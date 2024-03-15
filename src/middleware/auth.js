import jwt from 'jsonwebtoken';

function login(req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    return { userId };
}

// Adds user data if logged in AND enforces it
export const auth = (req, res, next) => {
    try {
        req.auth = login(req);
        next();
    } catch (error) {
        res.status(401).json(error);
    }
};

// Adds user data if logged in but DOES NOT enforce it
export const tryAuth = (req, _, next) => {
    try {
        req.auth = login(req);
        next();
    } catch (error) {
        next();
    }
};
