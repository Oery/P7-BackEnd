import { Router } from 'express';
import { param } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { validateRules } from '../middleware/validate.js';
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
bookRoutes.post('/', auth, createBook);
bookRoutes.get('/:id', idRule, validateRules, getBook);
bookRoutes.delete('/:id', idRule, validateRules, auth, deleteBook);
bookRoutes.put('/:id', idRule, validateRules, auth, updateBook);
bookRoutes.post('/:id/rating', idRule, validateRules, auth, rateBook);
bookRoutes.patch('/bestrating', getBestRating);

export default bookRoutes;
