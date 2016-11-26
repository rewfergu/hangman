import React from 'react';
import Gallows from './Gallows.js';
import Alphabets from './Alphabets.js';
import GuessedLetters from './GuessedLetters.js';
import RemainingGuess from './RemainingGuess.js';
import Word from './Word.js';


export default class Player1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guessedLetters: [],
      remainingGuesses: 6,
      isDone: false,
      players: [],
      coolDown: 0,
      timeUntilNextGame: 0,
    };
  }

  render() {
    console.log('word', this.props.word);
    const guessedLettersUpper = this.props.guessedLetters.map(letter => letter.toUpperCase());
    return (
      <section id="player1" className="row">
        <div className="col-sm-4" id="gallows-col">
          <Gallows remainingGuesses={this.props.remainingGuesses} />
        </div>
        <div className="col-sm-8">
          <div className="board">
            <h1 className="board__roomName">{this.props.roomName}</h1>
            <div className="board__playerName">Player 1:  {this.props.username}</div>
            <div id="guessed-row" className="board__letters">
              <GuessedLetters guessedLetters={guessedLettersUpper} />
              <RemainingGuess remainingGuesses={this.props.remainingGuesses} />
              <Word word={this.props.word} />
            </div>
          </div>
          <Alphabets
            guessedLetters={guessedLettersUpper}
            coolDown={this.props.coolDown}
            serverAPI={this.props.serverAPI}
            makeGuess={this.props.makeGuess}
          />
        </div>
      </section>
    );
  }
}
