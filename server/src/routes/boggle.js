import express from 'express';

const router = new express.Router();

router.get('/getboggleboard', ({ query }, res) => {
  if (!query.id) {
    // return random board with random seed
  } else {
    // return random boggle board with given seed (id)
  };

  res.send('getboggleboard');
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
