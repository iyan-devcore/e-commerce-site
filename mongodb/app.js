import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello World! from backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});