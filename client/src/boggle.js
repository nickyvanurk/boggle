import $ from 'jquery';

export default class Boggle {
  constructor(emitter, gameDurationInSeconds, fps) {
    this.emitter = emitter;
    this.gameDurationInSeconds = gameDurationInSeconds;
    this.fps = fps;

    this.boardWidth = 4;

    this.emitter.on('boggle-receive-letter-select-index', this.onReceiveSelectLetterIndex.bind(this));
    this.emitter.on('boggle-end-word', this.onEndWord.bind(this));

    this.reset();
  }

  start() {
    this.reset();

    $.getJSON('//localhost:3000/getboggleboard', (data) => {
      this.id = data.id;
      this.board = data.board;

      this.play();
    });
  }

  play() {
    this.emitter.emit('ui-draw-board', this.board);

    this.emitter.emit('ui-bind-mouse-event-handlers');

    this.currentTime = Date.now();
    this.boggleTimer = setInterval(() => {
      const elapsedTimeInSeconds = (Date.now() - this.currentTime) / 1000;
      const widthFraction = 100 / this.gameDurationInSeconds * elapsedTimeInSeconds;

      this.emitter.emit('ui-update-time-bar', widthFraction);
    }, 1000 / this.fps);

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

    $.getJSON('//localhost:3000/isvalidword', {
      id: this.id,
      selection: this.selectedLetters
    }, (data) => {
      if (!data.valid || !this.isValidWord(word)) return;

      $.getJSON('//localhost:3000/getwordscore', { word }, (data) => {
        const wordScore = data.score;

        this.foundWords.push(word);
        this.score += wordScore;

        this.emitter.emit('ui-display-word', word, wordScore);
        this.emitter.emit('ui-display-score', this.score);
      });
    });

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
    return (index < 0 || index >= this.boardWidth*this.boardWidth) ||
           (x === 1 && index % this.boardWidth === 0) ||
           (x === -1 && index % this.boardWidth === 3);
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

  isValidWord(word) {
    return word.length >= 3 && !this.foundWords.includes(word);
  }
}
