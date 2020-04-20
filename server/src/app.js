import express from 'express';
import cors from 'cors';
import boggleRouter from './routes/boggle';

const app = express();

app.use(cors());
app.use(express.json());
app.use(boggleRouter);

export default app;
