import './math';
import $ from 'jquery';

// TODO:
//    Create board generator that takes optional seed argument
//    currentWord array filled with mouseclick/hover
//    submit word on mouse release

const boggleDice = [
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

function getRandomBoard(seed, dice) {
  const rng = Math.seed(seed);
  const board = [];

  for (const die of dice) {
    board.push(getRandomDiceValue(rng, die));
  }

  return board;
}

function getRandomDiceValue(rng, dice) {
  return dice[getRandomInt(rng, 6)];
}

function getRandomInt(rng, max) {
  return Math.floor(rng() * Math.floor(max));
}

function drawBoard(board) {
  $('#board > .row .boggle').each(function (index) {
    $(this).children('span').each(function () {
      $(this).text(board[index]);
    })
  });
}

const board = getRandomBoard(2, boggleDice);

drawBoard(board);

let word = [];

let isMouseDown = false;

$(document).mousedown(function () {
  isMouseDown = true
});

$(document).mouseup(function () {
  $('#board > .row .boggle').removeClass('selected');

  console.log(word.join(''));
  word = [];

  isMouseDown = false
});

$('#board > .row .boggle').mousedown(function (index) {
  $(this).addClass('selected');

  const letter = $(this).text().trim().toUpperCase();
  word.push(letter);
});

$('#board > .row .boggle').mouseenter(function (index) {
  if (isMouseDown) {
    $(this).addClass('selected');

    const letter = $(this).text().trim().toUpperCase();
    word.push(letter);
  }
});













