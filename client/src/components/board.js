import React from 'react';
import Square from './square';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      squares: Array(16).fill(null),
      selection: [],
      isSelecting: false,
      error: null,
      isLoaded: false
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

  handleMouseDown(i) {
    this.setState({isSelecting: true});

    if (this.state.selection.includes(i)) {
      return;
    }

    this.selectSquare(i);
  }

  handleMouseEnter(i) {
    if (!this.state.isSelecting || this.state.selection.includes(i)) {
      return;
    }

    this.selectSquare(i);
  }

  handleMouseUp() {
    const {id, selection} = this.state;
    this.checkSelection(id, selection);
    this.resetSelection();
  }

  handleMouseLeave() {
    if (!this.state.selection.length) {
      return;
    }

    const {id, selection} = this.state;
    this.checkSelection(id, selection);
    this.resetSelection();
  }

  selectSquare(i) {
    const selection = this.state.selection.slice();
    selection.push(i);
    this.setState({selection});
  }

  resetSelection() {
    this.setState({
      isSelecting: false,
      selection: []
    });
  }

  checkSelection(id, selection) {
    fetch(`//localhost:3000/isvalidword?id=${id}&selection=${selection}`)
      .then(res => res.json())
      .then(({valid, word}) => {
        if (valid) {
          this.props.onFoundWord(word);
        }
      }, (error) => {
        this.setState({error});
      });
  }

  renderSquare(i) {
    return (
      <Square value={this.state.squares[i]}
              isSelected={this.state.selection.includes(i)}
              onMouseDown={() => this.handleMouseDown(i)}
              onMouseEnter={() => this.handleMouseEnter(i)} />
    );
  }

  render() {
    const {error, isLoaded} = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div onMouseUp={() => this.handleMouseUp()}
             onMouseLeave={() => this.handleMouseLeave()}>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            {this.renderSquare(3)}
          </div>
          <div className="board-row">
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            {this.renderSquare(6)}
            {this.renderSquare(7)}
          </div>
          <div className="board-row">
            {this.renderSquare(8)}
            {this.renderSquare(9)}
            {this.renderSquare(10)}
            {this.renderSquare(11)}
          </div>
          <div className="board-row">
            {this.renderSquare(12)}
            {this.renderSquare(13)}
            {this.renderSquare(14)}
            {this.renderSquare(15)}
          </div>
        </div>
      );
    }
  }
}
