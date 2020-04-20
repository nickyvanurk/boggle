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
    const board = Boggle.getRandomId(id);

    const word = Boggle.getWord(board, selection);

    let foundWord = false;

    fs.readFile(__dirname + '/../dictionaries/dutch.txt', (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      if (data.includes(`${word}\n`)) {
        foundWord = true;
        return;
      }
    });

    return foundWord;
  }

  static getWord(board, selection) {
    const word = [];

    for (const index of selection) {
      word.push(board[index]);
    }

    return word.join('');
  }
}
