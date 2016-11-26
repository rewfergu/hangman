import React from 'react';
import firebase from 'firebase';
import CreateGame from './CreateGame';

export default class FrontLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomsList: [],
      usersList: [],
      showCreate: false,
      fbGames: firebase.database().ref('games'),
      fbUsers: firebase.database().ref('users'),
      currentUserId: firebase.auth().currentUser.uid,
    };
  }

  componentWillMount() {
    this.state.fbGames.on('value', (data) => {
      console.log('raw data', data.val());
      const roomArray = [];
      data.forEach(room => {
        const playerKeys = Object.keys(room.child('players').val());
        if (playerKeys.includes(this.state.currentUserId) || playerKeys.length < room.child('totalPlayers').val()) {
          roomArray.push({
            id: room.key,
            name: room.child('name').val(),
            players: room.child('players').val(),
            totalPlayers: room.child('totalPlayers').val(),
          });
        }
      }); // end data.forEach
      console.log('processed data', roomArray);

      this.state.fbUsers.on('value', (data) => {
        console.log('fbUsers data = ', data.val());
        const usersArray = [];
        data.forEach(user => {
          usersArray.push({
            id: user.key,
            name: user.child('username').val(),
            winCount: user.child('winCount').val(),
          }); // end .push
        }); // end data.forEach
        usersArray.sort(this.userCompare);
        usersArray.splice(10);
        console.log("usersArray = ", usersArray);

        this.setState({
          roomsList: roomArray,
          usersList: usersArray,
        }); // end setState
      }); // end state.fbUsers
    }); // end state.fbGames
  } // end componentWillMount


  userCompare(a, b) {
    if (a.winCount > b.winCount) { // is less than b by some ordering criterion)
      return -1;
    }
    if (a.winCount < b.winCount) { // is greater than b by the ordering criterion) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  handleJoinRoom(id) {
    this.props.joinRoom(id);
  }

  checkForUser(callback) {
    firebase.initialize();
    callback();
  }

  cancelGame() {
    this.setState({
      showCreate: false,
    });
  }

  createGame(newGameObj) {
    this.props.serverAPI.createGame(firebase.auth().currentUser.uid, newGameObj)
    .then(() => {
      this.setState({
        showCreate: false,
      });
    });
  }

  showCreateGame() {
    return this.state.showCreate
      ? <CreateGame
        createGame={e => this.createGame(e)}
        cancelGame={e => this.cancelGame(e)}
        showCreateModal
      />
      : null;
  }

  showListOfRooms() {
    return (
      <ul className="roomList">
        {
          this.state.roomsList.map((room, index) =>
            <li key={index} className="roomList__item">
                <div className="roomList__name">
                  <span>{`Name: ${room.name}`}</span>
                  <button className="btn join-button" onClick={() => this.handleJoinRoom(room.id)} >Join Room</button>
                </div>
                
                <div>{`Type: ${room.totalPlayers === 1 ? 'Single Player' : 'Head To Head'}`}</div>
                
                <div>{`Players: ${Object.keys(room.players).length}`}</div>
            </li>
            )
        }
      </ul>
    );
  }

  showUserScoreboard() {
    return (
      <ol className="leaderboard user-list-item">
        <li>
        <div className="leaderboard-header">
          <span className="leaderboard-header-name">Name</span>
          <span className="leaderboard-header-win">Wins</span>
        </div>
        </li>
        {
          this.state.usersList.map((user, index) =>
            <li key={index}>
              <div className="leaderboard-item">
                <span className="leaderboard-name">{user.name}</span>
                <span className="leaderboard-score">{user.winCount}</span>
              </div>
            </li>
            )
       }
      </ol>
      ); // end return
  } // end userScoreboard

  handleCreate() {
    this.setState({
      showCreate: true,
    });
  }

  render() {
    return (
      <div>
        { this.showCreateGame() }
        <div className="container">
          <h1 className="welcome">Welcome to Hangman, {this.props.username}!</h1>
            <button
              id="new-game"
              className="btn createGame-button"
              onClick={e => this.handleCreate(e)}
            >
              Create Room
            </button>
          <div className="row">
            <div className="col-sm-4">
              <h2>Leaderboard</h2>
              {this.showUserScoreboard()}
            </div>
            <div className="col-sm-8">
              <h2 className="roomHeading">Rooms</h2>
              {this.showListOfRooms()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
