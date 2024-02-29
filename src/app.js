import express from 'express';
import Mongoose from 'mongoose';
import bookRoutes from './routes/book.js';
import userRoutes from './routes/user.js';
import cors from 'cors';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const corsSettings = {
    // origin: 'http://localhost:3000',
    origin: '*',
};

const app = express();

Mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cors(corsSettings));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.listen(4000);
