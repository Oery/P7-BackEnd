import { Router } from 'express';
import { param } from 'express-validator';
import { auth, tryAuth } from '../middleware/auth.js';
import { validateRules } from '../middleware/validate.js';
import { validateBook } from '../middleware/book.js';
import multer from '../middleware/multer-config.js';
import {
    createBook,
    deleteBook,
    getBook,
    getBooks,
    rateBook,
    updateBook,
    getBestRating,
} from '../controllers/book.js';

const bookRoutes = Router();

const idRule = [param('id').isMongoId().withMessage('Invalid book ID')];

bookRoutes.get('/', getBooks);
bookRoutes.post('/', auth, multer, createBook);
bookRoutes.get('/bestrating', getBestRating);
bookRoutes.get('/:id', idRule, validateRules, tryAuth, validateBook, getBook);
bookRoutes.delete('/:id', idRule, validateRules, auth, validateBook, deleteBook);
bookRoutes.put('/:id', idRule, validateRules, auth, validateBook, multer, updateBook);
bookRoutes.post('/:id/rating', idRule, validateRules, auth, validateBook, rateBook);

export default bookRoutes;
