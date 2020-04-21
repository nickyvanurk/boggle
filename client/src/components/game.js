import React from "react";
import Board from "./board";

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      foundWords: []
    };
  }

  handleFoundWord(word) {
    const foundWords = this.state.foundWords.slice();
    foundWords.push(word);
    this.setState({foundWords});
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board onFoundWord={(word) => this.handleFoundWord(word)} />
        </div>
      </div>
    );
  }
}

export default Game;
