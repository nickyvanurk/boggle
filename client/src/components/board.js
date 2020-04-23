import React from 'react';
import Letter from './letter';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLettersIndices: [],
      isSelecting: false,
    };
  }

  handleMouseDown(i) {
    this.setState({isSelecting: true});

    if (!this.isLetterSelected(i)) {
      this.selectLetter(i);
    }
  }

  handleMouseEnter(i) {
    if (this.state.isSelecting && !this.isLetterSelected(i)) {
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
      <div onMouseUp={() => this.handleMouseUp()}
           onMouseLeave={() => this.handleMouseLeave()}>
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
