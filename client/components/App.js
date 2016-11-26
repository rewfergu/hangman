import React from 'react';
import firebase from 'firebase';
import Login from './Login';
import FrontLobby from './FrontLobby';
import Room from './Room';
import firebaseConfig from '../../firebaseConfig.js';
import ServerAPI from '../models/ServerAPI';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    firebase.initializeApp(firebaseConfig);

    const test = firebase.database().ref('test');
    test.on('value', (data) => {
      console.log('data', data.val());
    });

    this.state = {
      play: false,
      auth: false,
      username: '',
      pageToRender: null,
    };
    this.serverAPI = new ServerAPI();
  }

  componentWillMount() {
    this.checkSession();
  }

  handleJoin(roomId) {
    console.log('roomId', roomId);
    const currentUserId = firebase.auth().currentUser.uid;
    firebase.database().ref(`games/${roomId}`).once('value', gameData => {
      const totalPlayers = gameData.child('totalPlayers').val();
      const playerList = Object.keys(gameData.child('players').val());
      console.log('Player list', playerList);
      if (totalPlayers < 2 || playerList.includes(currentUserId)) {
        this.setState({
          play: true,
          pageToRender: <Room returnToLobby={e => this.handleLobbyClick(e)} serverAPI={this.serverAPI} roomId={roomId} username={this.state.username} />,
        });
      } else if (totalPlayers === 2 && playerList.length < 2 && !playerList.includes(currentUserId)) {
        this.serverAPI.addPlayer(currentUserId, roomId)
        .then(() => {
        this.setState({
          play: true,
          pageToRender: <Room returnToLobby={e => this.handleLobbyClick(e)} serverAPI={this.serverAPI} roomId={roomId} username={this.state.username} />,
        });
        });
      }
    });
  }

  handleLogin(userName) {
    console.log('username: ', userName);
    this.setState({
      username: userName,
      auth: true,
    });
  }

  checkSession() {
    return firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("auth", user);
      var displayName = this.createUsername(user.email);
      this.setState({
        auth: true,
        username: displayName,
        pageToRender: <FrontLobby serverAPI={this.serverAPI} username={displayName} joinRoom={e => this.handleJoin(e)} />,
      });
    } else {
      this.setState({
        pageToRender: <Login handleLogin={e => this.handleLogin(e)} />,
      });
    }
    });
  }

  createUsername(email) {
    var atIndex = email.indexOf('@');
    var username = email.slice(0, atIndex);
    return username;
  }

  handleLobbyClick() {
    console.log('lobby is clicked');
    this.setState({
      play: false,
      pageToRender: <FrontLobby serverAPI={this.serverAPI} username={this.state.username} joinRoom={e => this.handleJoin(e)} />,
    });
  }

  render() {
    return (
      <div className="app">

        <nav className="menu">
          <ul className="menu__list">
            <li className="menu__title">
              HANGMAN
            </li>
            <li className="menu__item">
              <a onClick={e => this.handleLobbyClick(e)}>Lobby</a>
            </li>
            <li className="menu__item">
              <a onClick={() => firebase.auth().signOut()}>Sign Out</a>
            </li>
          </ul>
        </nav>

        <main>
          { this.state.pageToRender }
        </main>

        <footer>
          <img src="assets/duck.svg" alt="rubber duckies" />
        </footer>
      </div>
    );
  }
}
