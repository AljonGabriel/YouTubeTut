import express from 'express';
const app = express();
app.use(express.json());

import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';

app.use(
  session({
    secret: '123',
    resave: false,
    saveUninitialized: false,
  }),
);

import userRoutes from './routes/userRoutes.js';

//cors
import cors from 'cors';
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Service is ready'));

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server is listening to http://localhost:${port}`),
);
