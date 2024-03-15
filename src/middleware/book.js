import Book from '../models/book.js';

// Check if book is in database and attach it to request
export async function validateBook(req, res, next) {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send('Book not found');
        req.book = book;
        next();
    } catch (error) {
        return res.status(500).json({ error });
    }
}
