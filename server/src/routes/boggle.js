import express from 'express';
import Boggle from '../utils/boggle';
import validator from 'validator';

const router = new express.Router();

router.get('/getboggleboard', ({ query }, res) => {
  const { id } = query;

  if (!id) {
    const boardId = Boggle.getRandomId();

    return res.send({
      id: boardId,
      board: Boggle.getRandomBoard(boardId)
    });
  }

  if (!validator.isInt(id, { min: 0, max: 1000000000000 })) {
    return res.send({ error: 'Invalid id' });
  }

  res.send({
    id: id,
    board: Boggle.getRandomBoard(id)
  });
});

router.get('/isvalidword', ({ query }, res) => {
  let { id, selection } = query;

  if (typeof selection === 'string') {
    selection = selection.split(',');
  }

  if (!id || !selection) {
    return res.send({ error: 'You must provide a board id and selection' });
  }

  if (selection.length < 3) {
    return res.send({ error: 'You must provide a board id and selection' });
  }

  if (!validator.isInt(id, { min: 0, max: 1000000000000 })) {
    return res.send({ error: 'Invalid id' });
  }

  if (!Array.isArray(selection)) {
    return res.send({ error: 'Invalid word' });
  }

  for (const index of selection) {
    if (!validator.isInt(index, { min: 0, max: 15 })) {
      return res.send({ error: 'Invalid word' });
    }
  }

  const word = Boggle.getWord(id, selection);

  res.send({
    valid: Boggle.isValidWord(id, selection),
    word: Boggle.getWord(id, selection),
    score: Boggle.getWordScore(word)
  });
});

router.get('/getwordscore', ({ query }, res) => {
  const { word } = query;

  if (!word) {
    res.send({ error: 'You must provide a word' });
  }

  if (!validator.isAlpha(word) || !validator.isLength(word, { min: 3, max: 16 })) {
    return res.send({ error: 'Invalid word' });
  }

  res.send({ score: Boggle.getWordScore(word) });
});

export default router;
