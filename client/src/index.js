import './math';
import $ from 'jquery';

// DONE:
//    Create board generator that takes optional seed argument
//    currentWord array filled with mouseclick/hover
//    submit word on mouse release
//    Display found word

// TODO:
//    Calculate score for word
//    Add score and display score
//    3 minute timer
//    Add player + score to highscore by order
//    Show only top 10 highscore

class Boggle {
  constructor() {
    this.domElements = {
      document: $(document),
      letters: $('#board > .row .boggle'),
      wordsWrapper: $('.words'),
      words:  $('.word'),
      scoresWrapper: $('.scores'),
      scores: $('.score')
    };

    this.wordInDom = 0;
    this.maxWordsInDom = 9;

    this.domElements.document.mouseup(this.onMouseUp.bind(this));
    this.domElements.letters.mousedown(this.onMouseDown.bind(this));
    this.domElements.letters.mouseenter(this.onMouseEnter.bind(this));

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

    this.newGame();
  }

  newGame() {
    this.reset();

    this.seed = Math.floor(Math.random() * 1000000001);
    this.drawLetters(this.getRandomBoard(this.seed));
  }

  reset() {
    this.word = [];
    this.isMouseDown = false;

    this.domElements.letters.removeClass('selected');
  }

  onMouseUp() {
    if (this.word.length) {
      this.addWordToScoreBox(this.word.join(''));
    }

    this.reset();
  }

  onMouseDown(event) {
    this.isMouseDown = true;

    $(event.currentTarget).addClass('selected');
    this.word.push(this.getLetter(event.currentTarget));
  }


  onMouseEnter(event) {
    if (this.isMouseDown) {
      $(event.currentTarget).addClass('selected');
      this.word.push(this.getLetter(event.currentTarget));
    }
  }

  getLetter(element) {
    return $(element).text().trim().toUpperCase();
  }

  addWordToScoreBox(word) {
    this.domElements.wordsWrapper.append(`
      <div class="word">${word}</div>
    `);

    const score = Math.floor(Math.random() * 10);

    this.domElements.scoresWrapper.append(`
      <div class="score">${score}</div>
    `);

    this.wordInDom++;

    if (this.wordInDom >= this.maxWordsInDom) {
      this.removeWordFromScoreBox();

      this.wordInDom = this.maxWordsInDom;
    }
  }

  removeWordFromScoreBox() {
    this.domElements.words.first().remove();
    this.domElements.words = $(`.${this.domElements.words.first().attr('class')}`);

    this.domElements.scores.first().remove();
    this.domElements.scores = $(`.${this.domElements.scores.first().attr('class')}`);
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
}

const boggle = new Boggle();
