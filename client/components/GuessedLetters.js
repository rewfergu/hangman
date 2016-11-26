import React from 'react';

export default class GuessedLetters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="board__guessedLetters">
        <div>Letters Guessed:</div>
        <div>
          {
          this.props.guessedLetters.map((letter, index) =>
            <span key={index} className="guessedLetter" > { letter }</span>
          )}
        </div>
      </div>
    );
  }
}
