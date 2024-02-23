import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/user.js';
import { validateRules } from '../middleware/validate.js';

const userRoutes = Router();

const rules = [
    body('email').isEmail().withMessage('Veuillez renseigner un email valide'),
    body('password').notEmpty().withMessage('Veuillez renseigner un mot de passe'),
];

userRoutes.post('/signup', rules, validateRules, signup);
userRoutes.post('/login', rules, validateRules, login);

export default userRoutes;
