import express from 'express';
import Boggle from '../utils/boggle';
import validator from 'validator';

const router = new express.Router();

router.get('/getboggleboard', ({ query }, res) => {
  if (!query.id) {
    const id = Boggle.getRandomId();

    return res.send({
      id: id,
      board: Boggle.getRandomBoard(id)
    });
  }

  if (!validator.isInt(query.id, { min: 0, max: 1000000000000 })) {
    return res.send({
      error: 'Invalid id'
    });
  }

  res.send({
    id: query.id,
    board: Boggle.getRandomBoard(query.id)
  });
});

router.get('/isvalidword', ({ query }, res) => {
  if (!query.id || !query.word) {
    res.send({ error: 'You must provide a board id and word' });
  }

  res.send('isvalidword');
});

router.get('/scoreword', ({ query }, res) => {
  if (!query.word) {
    res.send({ error: 'You must provide a word' });
  }

  res.send('scoreword');
});

export default router;
