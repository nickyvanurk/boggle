import './math';
import $ from 'jquery';

// DONE:
//    Create board generator that takes optional seed argument
//    currentWord array filled with mouseclick/hover
//    submit word on mouse release
//    Display found word
//    Calculate score for word
//    Add score and display score
//    3 minute timer

// TODO:
//    Add player + score to highscore by order
//    Show only top 10 highscore

class Boggle {
  constructor() {
    this.domSelectors = {
      words: '.score-box .word',
      scores: '.score-box .score',
    };

    this.domElements = {
      document: $(document),
      letters: $('#board > .row .boggle'),
      wordsWrapper: $('.score-box .words'),
      words:  $(this.domSelectors.words),
      scoresWrapper: $('.score-box .scores'),
      scores: $(this.domSelectors.scores),
      totalScore: $('.score-box .total-score span'),
      timer: $('.timer'),
      overlay: $('.overlay'),
      userModal: $('#username-modal'),
      usernameInput: $('#username-input'),
    };

    this.maxWordsInDom = 9;
    this.gameOverTimeoutInSeconds = 6;
    this.isPlaying = false;

    this.domElements.document.mouseup(this.onMouseUp.bind(this));
    this.domElements.letters.mousedown(this.onMouseDown.bind(this));
    this.domElements.letters.mouseenter(this.onMouseEnter.bind(this));
    this.domElements.usernameInput.keypress(this.onKeypress.bind(this));

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
  }

  newGame() {
    this.words = [];
    this.wordInDom = 0;

    this.resetBoard();
    this.resetDom();

    this.seed = Math.floor(Math.random() * 1000000001);
    this.drawLetters(this.getRandomBoard(this.seed));

    clearTimeout(this.gameOverTimeout);
    clearTimeout(this.gameTimer);

    this.gameOverTimeout = setTimeout(this.newGame.bind(this), this.gameOverTimeoutInSeconds * 1000);

    this.currentTime = Date.now();
    this.gameTimer = setInterval(() => {
      const elapsedTimeInSeconds = (Date.now() - this.currentTime) / 1000;
      const width = 100 / this.gameOverTimeoutInSeconds * elapsedTimeInSeconds;
      this.domElements.timer.width(`${width}%`);
    }, 16);

    this.isPlaying = true;
  }

  resetBoard() {
    this.word = [];
    this.isMouseDown = false;

    this.domElements.letters.removeClass('selected');
  }

  resetDom() {
    $(this.domSelectors.words).not(':first').remove();
    $(this.domSelectors.scores).not(':first').remove();
    this.domElements.totalScore.text(0);
    this.domElements.timer.width('0%');
  }

  onMouseUp() {
    if (!this.isPlaying) return;

    const word = this.word.join('');

    if (this.isWordValid(word) && !this.isWordUsed(word)) {
      const score = this.getWordScore(word);

      this.addWordToScoreBox(word, score);
      this.incrementTotalScore(score);

      this.words.push(word);
    }

    this.resetBoard();
  }

  onMouseDown(event) {
    if (!this.isPlaying) return;

    this.isMouseDown = true;

    const letterElement = event.currentTarget;

    if (!this.isElementSelected(letterElement)) {
      this.selectElement(letterElement);
      this.addLetterToWord(letterElement);
    }
  }

  onMouseEnter(event) {
    if (!this.isPlaying) return;

    if (this.isMouseDown) {

      const letterElement = event.currentTarget;

      if (!this.isElementSelected(letterElement)) {
        this.selectElement(letterElement);
        this.addLetterToWord(letterElement);
      }
    }
  }

  onKeypress(event) {
    if (this.isPlaying) return;

    if (event.key === 'Enter') {
      const {overlay, userModal, usernameInput} = this.domElements;

      overlay.hide();
      userModal.hide();

      this.username = usernameInput.val();

      usernameInput.val('');

      this.newGame();
    }
  }

  getUsername({ usernameInput }) {
    const username = usernameInput.val();
    usernameInput.val('');
    return username;
  }

  hideUserModal({ overlay, userModal }) {
    overlay.hide();
    userModal.hide();
  }

  getLetter(element) {
    return $(element).text().trim().toUpperCase();
  }

  addWordToScoreBox(word, score) {
    this.domElements.wordsWrapper.append(`<div class="word">${word}</div>`);
    this.domElements.scoresWrapper.append(`<div class="score">${score}</div>`);

    this.wordInDom++;

    if (this.wordInDom >= this.maxWordsInDom) {
      this.removeWordFromScoreBox();

      this.wordInDom = this.maxWordsInDom;
    }
  }

  removeWordFromScoreBox() {
    this.domElements.words.first().remove();
    this.domElements.words = $(`.${this.domElements.words.first().attr('class').split(' ')[0]}`);

    this.domElements.scores.first().remove();
    this.domElements.scores = $(`.${this.domElements.scores.first().attr('class').split(' ')[0]}`);
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

  drawLetters(letters) {
    $(this.domElements.letters).each(function (index) {
      $(this).children('span').text(letters[index]);
    });
  }

  isElementSelected(element) {
    return $(element).hasClass('selected')
  }

  selectElement(element) {
    $(element).addClass('selected');
  }

  addLetterToWord(letterElement) {
    this.word.push($(letterElement).text().trim().toUpperCase());
  }

  isWordValid(word) {
    return word.length >= 3;
  }

  isWordUsed(word) {
    return this.words.indexOf(word) > -1;
  }

  getWordScore(word) {
    return word.length >= 8 ? 11 :
           word.length >= 7 ? 5 :
           word.length >= 6 ? 3 :
           word.length >= 5 ? 2 : 1;
  }

  incrementTotalScore(score) {
    let totalScore = +this.domElements.totalScore.text();
    this.domElements.totalScore.text(totalScore + score);
  }
}

const boggle = new Boggle();
