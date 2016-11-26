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
      <section id="player1" className="player">
        <Gallows remainingGuesses={this.props.remainingGuesses} />

        <div className="board">
          <h1 className="board__roomName">{this.props.roomName}</h1>
          <div className="board__playerName">
            <span>Player 1:</span>
            <span>{this.props.username}</span>
          </div>
          <RemainingGuess remainingGuesses={this.props.remainingGuesses} />
          <GuessedLetters guessedLetters={guessedLettersUpper} />
          <Word word={this.props.word} />
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
