import express from 'express';
import boggleRouter from './routes/boggle';

const app = express();

app.use(express.json());
app.use(boggleRouter);

export default app;
