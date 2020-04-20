import './math';

export default class Boggle {
  constructor(emitter, gameDurationInSeconds, fps) {
    this.emitter = emitter;
    this.gameDurationInSeconds = gameDurationInSeconds;
    this.fps = fps;

    this.dice = [
      ['R', 'I', 'F', 'O', 'B', 'X'],
      ['I', 'F', 'E', 'H', 'E', 'Y'],
      ['D', 'E', 'N', 'O', 'W', 'S'],
      ['U', 'T', 'O', 'K', 'N', 'D'],
      ['H', 'M', 'S', 'R', 'A', 'O'],
      ['L', 'U', 'P', 'E', 'T', 'S'],
      ['A', 'C', 'I', 'T', 'O', 'A'],
      ['Y', 'L', 'G', 'K', 'U', 'E'],
      ['Q', 'B', 'M', 'J', 'O', 'A'],
      ['E', 'H', 'I', 'S', 'P', 'N'],
      ['V', 'E', 'T', 'I', 'G', 'N'],
      ['B', 'A', 'L', 'I', 'Y', 'T'],
      ['E', 'Z', 'A', 'V', 'N', 'D'],
      ['R', 'A', 'L', 'E', 'S', 'C'],
      ['U', 'W', 'I', 'L', 'R', 'G'],
      ['P', 'A', 'C', 'E', 'M', 'D']
    ];

    this.boardWidth = 4;

    this.emitter.on('boggle-receive-letter-select-index', this.onReceiveSelectLetterIndex.bind(this));
    this.emitter.on('boggle-end-word', this.onEndWord.bind(this));

    this.reset();
  }

  play(seed) {
    this.reset();

    this.board = this.getRandomBoard(seed);
    this.emitter.emit('ui-draw-board', this.board);

    this.emitter.emit('ui-bind-mouse-event-handlers');

    this.currentTime = Date.now();
    this.boggleTimer = setInterval(() => {
      const elapsedTimeInSeconds = (Date.now() - this.currentTime) / 1000;
      const widthFraction = 100 / this.gameDurationInSeconds * elapsedTimeInSeconds;

      this.emitter.emit('ui-update-time-bar', widthFraction);
    }, 1 / this.fps);

    this.boggleTimeout = setTimeout(() => {
      clearTimeout(this.boggleTimeout);
      clearTimeout(this.boggleTimer);

      this.emitter.emit('ui-unbind-mouse-event-handlers');
      this.emitter.emit('ui-deselect-letters');
      this.emitter.emit('game-over', this.getScore());
    }, this.gameDurationInSeconds * 1000);
  }

  reset() {
    this.score = 0;
    this.selectedLetters = [];
    this.foundWords = [];
    this.board = [];

    this.emitter.emit('ui-reset-words');
    this.emitter.emit('ui-display-score', this.score);
  }

  onReceiveSelectLetterIndex(index) {
    if (!this.selectedLetters.length || this.isValidSelection(index)) {
      this.selectedLetters.push(index);

      this.emitter.emit('ui-select-letter-at-board-index', index);
    }
  }

  onEndWord() {
    const word = this.getWord(this.selectedLetters);

    if (this.isValidWord(word)) {
      const wordScore = this.getWordScore(word);

      this.foundWords.push(word);
      this.score += wordScore;

      this.emitter.emit('ui-display-word', word, wordScore);
      this.emitter.emit('ui-display-score', this.score);
    }

    this.selectedLetters = [];

    this.emitter.emit('ui-deselect-letters');
  }

  isValidSelection(index) {
    if (this.selectedLetters.indexOf(index) !== -1) return;

    const lastSelectionIndex = this.selectedLetters[this.selectedLetters.length - 1];

    const deltaIndex = index - lastSelectionIndex;

    return (deltaIndex === -1 && !this.isIndexOutOfBounds({ x: -1, y: 0 }, index) ||
           (deltaIndex === 1 && !this.isIndexOutOfBounds({ x: 1, y: 0 }, index)) ||
           (deltaIndex === -4 && !this.isIndexOutOfBounds({ x: 0, y: -1 }, index)) ||
           (deltaIndex === 4 && !this.isIndexOutOfBounds({ x: 0, y: 1 }, index)) ||
           (deltaIndex === -5 && !this.isIndexOutOfBounds({ x: -1, y: -1 }, index)) ||
           (deltaIndex === 5 && !this.isIndexOutOfBounds({ x: 1, y: 1 }, index)) ||
           (deltaIndex === -3 && !this.isIndexOutOfBounds({ x: 1, y: -1 }, index)) ||
           (deltaIndex === 3 && !this.isIndexOutOfBounds({ x: -1, y: 1 }, index)));
  }

  isIndexOutOfBounds({ x, y }, index) {
    return (index < 0 || index >= this.dice.length) ||
           (x === 1 && index % this.boardWidth === 0) ||
           (x === -1 && index % this.boardWidth === 3);
  }

  isValidWord(word) {
    return word.length >= 3 && !this.foundWords.includes(word);
  }

  getScore() {
    return this.score;
  }

  getWord(boardIndices) {
    const word = [];

    for (const index of boardIndices) {
      word.push(this.board[index]);
    }

    return word.join('');
  }

  getRandomBoard(seed) {
    const board = [];
    const rng = Math.seed(seed);

    for (const die of this.dice) {
      const randomDieValue = die[Math.floor(rng() * Math.floor(6))];
      board.push(randomDieValue);
    }

    return board;
  }

  getWordScore(word) {
    return word.length >= 8 ? 11 :
           word.length >= 7 ? 5 :
           word.length >= 6 ? 3 :
           word.length >= 5 ? 2 : 1;
  }
}
