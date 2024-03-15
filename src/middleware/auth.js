import jwt from 'jsonwebtoken';

// Adds user data if logged in AND enforces it
export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = { userId };
        next();
    } catch (error) {
        res.status(401).json(error);
    }
};

// Adds user data if logged in but DOES NOT enforce it
export const tryAuth = (req, _, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = { userId };
        next();
    } catch (error) {
        next();
    }
};
