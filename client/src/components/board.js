import React from 'react';
import PropTypes from 'prop-types';
import Letter from './letter';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLettersIndices: [],
      isSelecting: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseDown(i) {
    this.setState({isSelecting: true});

    if (this.isValidLetterSelection(i)) {
      this.selectLetter(i);
    }
  }

  handleMouseEnter(i) {
    if (this.state.isSelecting && this.isValidLetterSelection(i)) {
      this.selectLetter(i);
    }
  }

  handleMouseUp() {
    this.props.onSelectWord(this.state.selectedLettersIndices);
    this.deselectLetters();
  }

  handleMouseLeave() {
    const {selectedLettersIndices} = this.state;

    if (selectedLettersIndices.length) {
      this.props.onSelectWord(selectedLettersIndices);
      this.deselectLetters();
    }
  }

  isLetterSelected(i) {
    return this.state.selectedLettersIndices.includes(i);
  }

  selectLetter(i) {
    const selectedLettersIndices = this.state.selectedLettersIndices.slice();
    selectedLettersIndices.push(i);
    this.setState({selectedLettersIndices});
  }

  deselectLetters() {
    this.setState({
      selectedLettersIndices: [],
      isSelecting: false
    });
  }

  isValidLetterSelection(i) {
    const {selectedLettersIndices} = this.state;

    if (selectedLettersIndices.length === 0) {
      return true;
    }

    if (selectedLettersIndices.includes(i)) {
      return false;
    }

    const lastSelectionIndex = selectedLettersIndices[selectedLettersIndices.length - 1];
    const deltaIndex = i - lastSelectionIndex;

    return (deltaIndex === -1 && !this.isIndexOutOfBounds({ x: -1, y: 0 }, i) ||
           (deltaIndex === 1 && !this.isIndexOutOfBounds({ x: 1, y: 0 }, i)) ||
           (deltaIndex === -4 && !this.isIndexOutOfBounds({ x: 0, y: -1 }, i)) ||
           (deltaIndex === 4 && !this.isIndexOutOfBounds({ x: 0, y: 1 }, i)) ||
           (deltaIndex === -5 && !this.isIndexOutOfBounds({ x: -1, y: -1 }, i)) ||
           (deltaIndex === 5 && !this.isIndexOutOfBounds({ x: 1, y: 1 }, i)) ||
           (deltaIndex === -3 && !this.isIndexOutOfBounds({ x: 1, y: -1 }, i)) ||
           (deltaIndex === 3 && !this.isIndexOutOfBounds({ x: -1, y: 1 }, i)));
  }

  isIndexOutOfBounds({ x }, i) {
    const boardWidth = 4;
    return (i < 0 || i >= this.props.letters.length) ||
           (x === 1 && i % boardWidth === 0) ||
           (x === -1 && i % boardWidth === 3);
  }

  renderLetter(i) {
    return (
      <Letter value={this.props.letters[i]}
              isSelected={this.isLetterSelected(i)}
              onMouseDown={() => this.handleMouseDown(i)}
              onMouseEnter={() => this.handleMouseEnter(i)} />
    );
  }

  render() {
    return (
      <div onMouseUp={this.handleMouseUp}
           onMouseLeave={this.handleMouseLeave}>
        <div className="board-row">
          {this.renderLetter(0)}
          {this.renderLetter(1)}
          {this.renderLetter(2)}
          {this.renderLetter(3)}
        </div>
        <div className="board-row">
          {this.renderLetter(4)}
          {this.renderLetter(5)}
          {this.renderLetter(6)}
          {this.renderLetter(7)}
        </div>
        <div className="board-row">
          {this.renderLetter(8)}
          {this.renderLetter(9)}
          {this.renderLetter(10)}
          {this.renderLetter(11)}
        </div>
        <div className="board-row">
          {this.renderLetter(12)}
          {this.renderLetter(13)}
          {this.renderLetter(14)}
          {this.renderLetter(15)}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectWord: PropTypes.func.isRequired
};
