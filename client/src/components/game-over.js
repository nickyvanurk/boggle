import React from 'react';

export default class GameOver extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {totalScore} = this.props;

    return (
      <div>
        <h2>Game Over</h2>
        <span>You scored {totalScore} {totalScore === 1 ? 'point' : 'points'}</span>
        <input placeholder="Player name" />
        <button>Submit Highscore</button>
      </div>
    );
  }
}
