import { validationResult } from 'express-validator';

// Validate request body
export function validateRules(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({ errors: errors.array() });
}
