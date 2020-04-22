import React from "react";
import Board from "./board";
import FoundWordsWithScore from './found-words-with-score';
import Clock from './clock';
import GameOver from './game-over';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      squares: Array(16).fill(null),
      foundWords: [],
      isLoaded: false,
      error: null,
      isGameOver: false,
      seconds: 0,
      minutes: 3
    };
  }

  componentDidMount() {
    fetch('//localhost:3000/getboggleboard')
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          id: result.id,
          squares: result.board
        });
      }, (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      });

    this.tick = setInterval(() => {
      const {seconds, minutes} = this.state;

      if (seconds > 0) {
        this.setState({
          seconds: seconds - 1
        });
      } else {
        if (minutes === 0) {
          clearInterval(this.tick);
          this.props.handleGameOver();
        } else {
          this.setState({
            minutes: minutes - 1,
            seconds: 59
          });
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tick);
  }

  handleGameOver() {
    this.setState({
      isGameOver: !this.state.isGameOver
    });
  }

  handleSelection(selection) {
    const {id} = this.state;
    fetch(`//localhost:3000/isvalidword?id=${id}&selection=${selection}`)
      .then(res => res.json())
      .then(({valid, word, score}) => {
        if (valid) {
          for (const obj of this.state.foundWords) {
            if (obj.word === word) {
              return;
            }
          }

          const foundWords = this.state.foundWords.slice();
          foundWords.push({word, score});
          this.setState({foundWords});
        }
      }, (error) => {
        this.setState({error});
      });
  }

  render() {
    const {error, isLoaded} = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="game">
          <div className="game-clock">
            <Clock seconds={this.state.seconds}
                   minutes={this.state.minutes} />
          </div>

          <div className="found-words">
            <FoundWordsWithScore words={this.state.foundWords}
                                 maxWords={5} />
          </div>

          <div className="game-board">
            <Board squares={this.state.squares}
                   onSelection={(selection) => this.handleSelection(selection)} />
          </div>

          {this.state.isGameOver && (
            <div className="modal">
              <GameOver />
            </div>
          )}
        </div>
      );
    }
  }
}

export default Game;
