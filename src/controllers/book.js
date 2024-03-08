import sharp from 'sharp';
import Book from '../models/book.js';
import fs from 'fs';

// req.book is set by validateBook middleware in middleware/book.js
// req.auth is set by auth middleware in middleware/auth.js

export const createBook = async (req, res) => {
    const book = JSON.parse(req.body.book);

    const thisYear = new Date().getFullYear();
    if (book.year > thisYear) {
        return res.status(400).json({ error: 'Invalid year' });
    }

    sharp(req.file.path)
        .resize(800)
        .jpeg({ quality: 80, chromaSubsampling: '4:2:0' })
        .toFile(`public/images/${req.file.filename}`)
        .then(() => {
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('Image compressed and original deleted');
            });
        })
        .catch((error) => console.log(error));

    const newBook = new Book({
        ...book,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    newBook
        .save()
        .then(() => res.status(201).json({ message: 'Book created' }))
        .catch((error) => res.status(400).json({ error }));
};

export const getBooks = async (_, res) => {
    const books = await Book.find().select('-ratings'); // TODO: question mentor
    return res.status(200).json(books);
};

export const getBook = async (req, res) => {
    return res.status(200).json(req.book); // req.book is set by validateBook middleware
};

export const deleteBook = async (req, res) => {
    if (req.auth.userId !== req.book.userId) {
        return res.status(403).send('Forbidden');
    }

    const filename = req.book.imageUrl.split('/images/')[1];
    fs.unlink(`public/images/${filename}`, () => {
        req.book
            .deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Book deleted' }))
            .catch((error) => res.status(401).json({ error }));
    });
};

export const rateBook = async (req, res) => {
    const book = req.book;

    const userRating = book.ratings.find((r) => r.userId === req.body.userId);
    if (userRating) return res.status(400).send('User already rated this book');

    book.ratings.push({
        userId: req.body.userId,
        grade: req.body.rating,
    });

    book.getAverageRating();
    await book.save();
    return res.status(200).send('Rating updated');
};

export const updateBook = async (req, res) => {
    if (req.auth.userId !== req.book.userId) {
        return res.status(403).send('Forbidden');
    }

    if (!req.file) {
        await Book.updateOne({ _id: req.params.id }, { ...req.body });
        return res.status(200).send('Book updated');
    }

    const book = JSON.parse(req.body.book);

    sharp(req.file.path)
        .resize(800)
        .jpeg({ quality: 80, chromaSubsampling: '4:2:0' })
        .toFile(`public/images/${req.file.filename}`)
        .then(() => {
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('Image compressed and original deleted');
            });
        })
        .catch((error) => console.log(error));

    const oldImage = req.book.imageUrl.split('/images/')[1];
    fs.unlink(`public/images/${oldImage}`, () => {
        console.log('Old image deleted');
    });

    const newBook = {
        ...book,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    };

    await Book.updateOne({ _id: req.params.id }, { ...newBook });
    return res.status(200).send('Book updated');
};

export const getBestRating = async (_, res) => {
    const result = await Book.find().select('-ratings').sort({ averageRating: -1 }).limit(3);
    return res.json(result);
};
