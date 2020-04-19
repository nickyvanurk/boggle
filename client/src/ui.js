import $ from 'jquery';

export default class Ui {
  constructor(emitter) {
    this.emitter = emitter;

    this.emitter.on('ui-show-player-name-modal', this.onShowPlayerNameModal.bind(this));
    this.emitter.on('ui-hide-player-name-modal', this.onHidePlayerNameModal.bind(this));
    this.emitter.on('ui-draw-board', this.onDrawBoard.bind(this));
    this.emitter.on('ui-update-time-bar', this.onUpdateTimeBar.bind(this));

    this.emitter.on('ui-bind-mouse-event-handlers', this.onBindMouseEventHandlers.bind(this));
    this.emitter.on('ui-unbind-mouse-event-handlers', this.onUnbindMouseEventHandlers.bind(this));

    this.emitter.on('ui-select-letter-at-board-index', this.onSelectLetterAtBoardIndex.bind(this));
    this.emitter.on('ui-deselect-letter-at-board-index', this.onDeselectLetterAtBoardIndex.bind(this));
    this.emitter.on('ui-deselect-letters', this.onDeselectLetters.bind(this));

    this.emitter.on('ui-display-word', this.onDisplayWord.bind(this));
    this.emitter.on('ui-display-score', this.onDisplayScore.bind(this));

    this.emitter.on('ui-display-highscores', this.onDisplayHighscores.bind(this));

    this.emitter.on('ui-reset-words', this.onResetWords.bind(this));

    this.domSelectors = {
      letters: '#board > .row .boggle',

      overlay: '.overlay',
      playerNameModal: '#username-modal',
      playerNameInput: '#username-input',

      timeBar: '.timer',

      wordsContainer: '.score-box .words',
      words: '.score-box .word',
      scoresContainer: '.score-box .scores',
      scores: '.score-box .score',

      totalScore: '.score-box .total-score span',

      highscore: {
        usernamesWrapper: '.high-score-box .usernames',
        usernames: '.high-score-box .username',
        scoresWrapper: '.high-score-box .scores',
        scores: '.high-score-box .score',
      }
    };

    this.isMouseDown = false;

    this.wordsInDom = 0;
    this.maxWords = 9;

    this.highscoresInDom = 0;
    this.maxHighscores = 11;
  }

  onShowPlayerNameModal() {
    $(this.domSelectors.overlay).show();
    $(this.domSelectors.playerNameModal).show();

    $(this.domSelectors.playerNameInput).keypress((event) => {
      if (event.key === 'Enter') {
        const playerName = $(event.target).val();

        this.emitter.emit('game-set-player-name', playerName);
      }
    });
  }

  onHidePlayerNameModal() {
    $(this.domSelectors.overlay).hide();
    $(this.domSelectors.playerNameModal).hide();
    $(this.domSelectors.playerNameInput).unbind();
  }

  onDrawBoard(board) {
    $(this.domSelectors.letters).each(function (index) {
        $(this).children('span').text(board[index]);
    });
  }

  onUpdateTimeBar(widthFraction) {
    $(this.domSelectors.timeBar).width(`${widthFraction}%`);
  }

  onBindMouseEventHandlers() {
    $('body').mouseup(() => {
      this.isMouseDown = false;

      this.emitter.emit('boggle-end-word');
    });

    $(this.domSelectors.letters).mousedown(({ currentTarget }) => {
      this.isMouseDown = true;

      const index = $(this.domSelectors.letters).index(currentTarget);

      this.emitter.emit('boggle-receive-letter-select-index', index);
    });

    $(this.domSelectors.letters).mouseenter(({ currentTarget }) => {
      if (!this.isMouseDown) return;

      const index = $(this.domSelectors.letters).index(currentTarget);

      this.emitter.emit('boggle-receive-letter-select-index', index);
    });
  }

  onUnbindMouseEventHandlers() {
    $(this.domSelectors.letters).unbind();
  }

  onSelectLetterAtBoardIndex(index) {
    const element = $(this.domSelectors.letters).get(index);

    $(element).addClass('selected');
  }

  onDeselectLetterAtBoardIndex(index) {
    const element = $(this.domSelectors.letters).get(index);

    $(element).removeClass('selected');
  }

  onDeselectLetters() {
    $(this.domSelectors.letters).removeClass('selected');
  }

  onDisplayWord(word, score) {
    $(this.domSelectors.wordsContainer).append(`<div class="word">${word}</div>`);
    $(this.domSelectors.scoresContainer).append(`<div class="score">${score}</div>`);

    this.wordsInDom++;

    if (this.wordsInDom >= this.maxWords) {
      $(this.domSelectors.words).first().remove();
      $(this.domSelectors.scores).first().remove();

      this.wordInDom = this.maxWords;
    }
  }

  onDisplayScore(score) {
    $(this.domSelectors.totalScore).text(score);
  }

  onDisplayHighscores(highscores) {
    $(this.domSelectors.highscore.usernames).remove();
    $(this.domSelectors.highscore.scores).remove();

    this.highscoresInDom = 0;

    for (const { playerName, score } of highscores) {
      if (this.highscoresInDom >= this.maxHighscores) return;

      $(this.domSelectors.highscore.usernamesWrapper).append(`
        <div class="username">${playerName}</div>
      `);

      $(this.domSelectors.highscore.scoresWrapper).append(`
        <div class="score">${score}</div>
      `);

      this.highscoresInDom++;
    }
  }

  onResetWords() {
    $(this.domSelectors.words).first().remove();
    $(this.domSelectors.scores).first().remove();

    this.wordInDom = 0;
  }
}
