import React from 'react';
import Square from './square';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      isSelecting: false,
    };
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
    const {selection} = this.state;
    this.props.onSelection(selection);
    this.resetSelection();
  }

  handleMouseLeave() {
    if (!this.state.selection.length) {
      return;
    }

    const {selection} = this.state;
    this.props.onSelection(selection);
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

  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
              isSelected={this.state.selection.includes(i)}
              onMouseDown={() => this.handleMouseDown(i)}
              onMouseEnter={() => this.handleMouseEnter(i)} />
    );
  }

  render() {
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
