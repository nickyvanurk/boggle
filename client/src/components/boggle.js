import React from "react";
import Board from "./board";
import FoundWordsWithScore from './found-words-with-score';
import Countdown from './countdown';
import GameOver from './game-over';
import HighScore from './high-score';

export default class Boggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      letters: Array(16).fill(null),
      foundWords: [],
      isLoaded: false,
      error: null,
      isGameOver: false,
      hasSubmitHighscore: false,
      countdown: {
        seconds: 0,
        minutes: 3
      },
      highscores: []
    };

    this.handleSelectWord = this.handleSelectWord.bind(this);
    this.handleHighscoreSubmit = this.handleHighscoreSubmit.bind(this);
    this.handlePlayAgainClick = this.handlePlayAgainClick.bind(this);
  }

  componentDidMount() {
    fetch('//localhost:3000/getboggleboard')
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          id: result.id,
          letters: result.board
        });
      }, (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      });

    this.tick = setInterval(() => {
      const {seconds, minutes} = this.state.countdown;

      if (seconds > 0) {
        this.setState({
          countdown: {
            seconds: seconds - 1,
            minutes
          }
        });
      } else {
        if (minutes === 0) {
          clearInterval(this.tick);
          this.handleGameOver();
        } else {
          this.setState({
            countdown: {
              seconds: 59,
              minutes: minutes - 1
            }
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
      isGameOver: true
    });
  }

  handleSelectWord(lettersIndices) {
    const {id} = this.state;
    fetch(`//localhost:3000/isvalidword?id=${id}&selection=${lettersIndices}`)
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

  handleHighscoreSubmit(playerName, score) {
    const highscores = this.state.highscores.slice();
    highscores.push({playerName, score});

    highscores.sort((a, b) => {
      return a.score > b.score ? -1 :
             a.score < b.score ? 1 : 0;
    })

    this.setState({highscores, hasSubmitHighscore: true});
  }

  handlePlayAgainClick() {
    this.setState({isGameOver: false, hasSubmitHighscore: false});
  }

  getTotalScore() {
    return this.state.foundWords.reduce((totalScore, word) => {
      return totalScore + word.score
    }, 0);
  }

  render() {
    const {error, isLoaded} = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="boggle">
          <div className="boggle-countdown">
            <Countdown seconds={this.state.countdown.seconds}
                       minutes={this.state.countdown.minutes} />
          </div>

          <div className="boggle-found-words">
            <FoundWordsWithScore words={this.state.foundWords}
                                 maxWords={5} />
          </div>

          <div className="boggle-board">
            <Board letters={this.state.letters}
                   onSelectWord={this.handleSelectWord} />
          </div>

          {this.state.isGameOver && (
            <div className="boggle-modal">
              {this.state.hasSubmitHighscore
                ? <HighScore highscores={this.state.highscores}
                             maxPlayers={5}
                             onPlayAgainClick={this.handlePlayAgainClick} />
                : <GameOver totalScore={this.getTotalScore()}
                            onHighscoreSubmit={this.handleHighscoreSubmit} />
              }
            </div>
          )}
        </div>
      );
    }
  }
}
