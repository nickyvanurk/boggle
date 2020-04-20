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
  const { id, word } = query;

  if (!id || !word) {
    res.send({ error: 'You must provide a board id and word' });
  }

  if (!validator.isInt(id, { min: 0, max: 1000000000000 })) {
    return res.send({ error: 'Invalid id' });
  }

  if (!validator.isAlpha(word) || !validator.isLength(word, { min: 3, max: 16 })) {
    return res.send({ error: 'Invalid word' });
  }

  res.send({ isValid: Boggle.isValidWord(id, word) });
});

router.get('/scoreword', ({ query }, res) => {
  if (!query.word) {
    res.send({ error: 'You must provide a word' });
  }

  res.send('scoreword');
});

export default router;
