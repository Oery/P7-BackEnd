import Book from '../models/book.js';
import { compressImage, deleteImage, updateImage } from '../utils/image.js';

// req.book is set by validateBook middleware in middleware/book.js
// req.auth is set by auth middleware in middleware/auth.js

const MAX_IMAGE_SIZE = 170_000; // 170 kb

export const createBook = async (req, res) => {
    let book;
    try {
        book = JSON.parse(req.body.book);
    } catch (error) {
        return res.status(400).json(error);
    }

    try {
        await compressImage(req.file, MAX_IMAGE_SIZE);
    } catch (error) {
        return res.status(500).json(error);
    }

    const newBook = new Book({
        ...book,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    return newBook
        .save()
        .then(() => res.status(201).send({ message: 'Book created' }))
        .catch((error) => res.status(400).json(error));
};

export const getBooks = async (_, res) => {
    return Book.find()
        .select('-ratings') // remove ratings from response
        .then((books) => res.json(books))
        .catch((error) => res.status(500).json(error));
};

// Get book by ID and filter ratings to only show current user rating
export const getBook = async (req, res) => {
    req.book.ratings = req.auth ? req.book.ratings.filter((r) => r.userId !== req.auth.userId) : [];
    return res.json(req.book);
};

export const deleteBook = async (req, res) => {
    if (req.auth.userId !== req.book.userId) {
        return res.status(403).send('Forbidden');
    }

    try {
        const filename = req.book.imageUrl.split('/images/')[1];
        await deleteImage(filename);
        await req.book.deleteOne({ _id: req.params.id });
        return res.send({ message: 'Book deleted' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const rateBook = async (req, res) => {
    const book = req.book;

    const userRating = book.ratings.find((r) => r.userId === req.body.userId);
    if (userRating) return res.status(400).send('User already rated this book');

    book.ratings.push({
        userId: req.body.userId,
        grade: req.body.rating,
    });

    return book
        .getAverageRating()
        .save()
        .then(() => res.json(book))
        .catch((error) => res.status(500).json(error));
};

export const updateBook = async (req, res) => {
    if (req.auth.userId !== req.book.userId) {
        return res.status(403).send('Forbidden');
    }

    if (!req.file) {
        return Book.updateOne({ _id: req.params.id }, { ...req.body })
            .then(() => res.send({ message: 'Book updated' }))
            .catch((error) => res.status(500).json(error));
    }

    let book;
    try {
        book = JSON.parse(req.body.book);
    } catch (error) {
        return res.status(400).json(error);
    }

    try {
        await updateImage(req, MAX_IMAGE_SIZE);
    } catch (error) {
        return res.status(500).json(error);
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    return Book.updateOne({ _id: req.params.id }, { ...book, imageUrl })
        .then(() => res.send({ message: 'Book updated' }))
        .catch((error) => res.status(500).json(error));
};

export const getBestRating = async (_, res) => {
    return Book.find()
        .select('-ratings') // remove ratings arrays
        .sort({ averageRating: -1 }) // sort by average rating
        .limit(3)
        .then((result) => res.json(result))
        .catch((error) => res.status(500).json(error));
};
