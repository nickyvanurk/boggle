import { randomNumberGenerator } from './math';
import fs from 'fs';

export default class Boggle {
  static dice = [
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

  static getRandomId() {
    return Math.floor(Math.random() * 1000000000001);
  }

  static getRandomBoard(seed) {
    const board = [];
    const rng = seed ? randomNumberGenerator(seed) : Math.random;

    for (const die of this.dice) {
      const randomDieValue = die[Math.floor(rng() * Math.floor(6))];
      board.push(randomDieValue);
    }

    return board;
  }

  static isValidWord(id, selection) {
    if (!this.isValidSelection(selection)) return false;

    const board = Boggle.getRandomBoard(id);
    const word = Boggle.getWord(board, selection);

    const fileContent = fs.readFileSync(__dirname + '/../dictionaries/dutch.txt');

    const re = new RegExp(`\\b${word}\\b`);

    return re.test(fileContent);
  }

  static getWord(board, selection) {
    const word = [];

    for (const index of selection) {
      word.push(board[index]);
    }

    return word.join('').toLowerCase();
  }

  static getWordScore(word) {
    return word.length >= 8 ? 11 :
           word.length >= 7 ? 5 :
           word.length >= 6 ? 3 :
           word.length >= 5 ? 2 : 1;
  }

  static isValidSelection(selection) {
    const validSelection = [];

    for (const index of selection) {
      if (validSelection.length && !this.isValidIndex(validSelection, index)) {
        return false;
      }

      validSelection.push(index);
    }

    return true;
  }

  static isValidIndex(validSelection, index) {
    if (validSelection.indexOf(index) !== -1) return;

    const lastSelectionIndex = validSelection[validSelection.length - 1];

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

  static isIndexOutOfBounds({ x, y }, index) {
    return (index < 0 || index >= this.dice.length) ||
           (x === 1 && index % this.boardWidth === 0) ||
           (x === -1 && index % this.boardWidth === 3);
  }
}
