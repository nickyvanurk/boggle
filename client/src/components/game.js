import React from "react";
import Board from "./board";

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      squares: Array(16).fill(null),
      foundWords: [],
      isLoaded: false,
      error: null
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
  }

  handleSelection(selection) {
    const {id} = this.state;
    fetch(`//localhost:3000/isvalidword?id=${id}&selection=${selection}`)
      .then(res => res.json())
      .then(({valid, word}) => {
        if (valid) {
          const foundWords = this.state.foundWords.slice();
          foundWords.push(word);
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
          <div className="game-board">
            <Board squares={this.state.squares}
                  onSelection={(selection) => this.handleSelection(selection)} />
          </div>
        </div>
      );
    }
  }
}

export default Game;
