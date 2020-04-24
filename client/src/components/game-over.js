import React from 'react';
import PropTypes from 'prop-types';

export default class GameOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({playerName: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onHighscoreSubmit(this.state.playerName, this.props.totalScore);
  }

  validateInput(playerName) {
    return {
      playerName: playerName.length < 3 || playerName.length >= 16
    };
  }

  render() {
    const {totalScore} = this.props;
    const errors = this.validateInput(this.state.playerName);
    const isEnabled = !Object.keys(errors).some(x => errors[x]);

    return (
      <div>
        <h2>Game Over</h2>
        <span>You scored {totalScore} {totalScore === 1 ? 'point' : 'points'}</span>
        <form onSubmit={this.handleSubmit}>
          <input className={this.state.playerName.length > 0 && errors.playerName ? 'error' : ''}
                 placeholder="Player name"
                 value={this.state.value}
                 onChange={this.handleChange} />
          <button type="submit"
                  disabled={!isEnabled}>Submit Highscore</button>
        </form>
      </div>
    );
  }
}

GameOver.propTypes = {
  totalScore: PropTypes.number.isRequired,
  onHighscoreSubmit: PropTypes.func.isRequired
};
