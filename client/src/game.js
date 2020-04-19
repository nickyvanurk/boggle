import EventEmitter from 'EventEmitter';
import Boggle from './boggle';
import Ui from './ui';

export default class Game {
  constructor() {
    this.gameDurationInSeconds = 2;

    this.playername = '';
    this.highscores = [];

    this.emitter = new EventEmitter();

    this.emitter.on('game-start', this.onStart.bind(this));
    this.emitter.on('game-over', this.onGameOver.bind(this));
    this.emitter.on('game-set-player-name', this.onSetPlayerName.bind(this));

    this.ui = new Ui(this.emitter);
    this.boggle = new Boggle(this.emitter, this.gameDurationInSeconds, 60);

    this.emitter.emit('ui-show-player-name-modal');
  }

  start() {
    this.play();
  }

  play() {
    this.emitter.emit('ui-hide-player-name-modal');
    this.emitter.emit('ui-display-highscores', this.highscores)

    const seed = Math.floor(Math.random() * 1000000001);

    this.boggle.play(seed);
  }

  onStart() {
    this.emitter.emit('ui-hide-game-over-modal');

    this.start();
  }

  onGameOver(score) {
    const playerHighscore = this.highscores.find(x => x.playerName === this.playerName);

    if (playerHighscore === undefined) {
      if (score > 0) {
        this.highscores.push({ playerName: this.playerName, score });

        this.highscores.sort((a, b) => {
          return a.score > b.score ? -1 :
                a.score < b.score ? 1 : 0;
        });
      }
    } else if (score > playerHighscore.score) {
      playerHighscore.score = score;

      this.highscores.sort((a, b) => {
        return a.score > b.score ? -1 :
               a.score < b.score ? 1 : 0;
      });
    }

    this.emitter.emit('ui-show-game-over-modal', score);
  }

  onSetPlayerName(playerName) {
    this.playerName = playerName;

    this.play();
  }
}
