import express from 'express';
import Mongoose from 'mongoose';
import bookRoutes from './routes/book.js';
import userRoutes from './routes/user.js';
import cors from 'cors';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

// Create temp and public folders if they don't exist
if (!fs.existsSync('temp')) fs.mkdirSync('temp');
if (!fs.existsSync('public')) fs.mkdirSync('public');
if (!fs.existsSync('public/images')) fs.mkdirSync('public/images');

// Clean temp folder
const files = fs.readdirSync('temp');
files.forEach((file) => {
    fs.unlinkSync(`temp/${file}`);
});

const corsSettings = {
    origin: process.env.APP_URL,
};

const app = express();

Mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

app.use(express.static('public'));
app.use(express.json());
app.use(cors(corsSettings));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.listen(process.env.API_PORT);
