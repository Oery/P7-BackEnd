import Book from '../models/book.js';

export async function validateBook(req, res, next) {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    req.book = book;
    next();
}