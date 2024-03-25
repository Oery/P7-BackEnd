import jwt from 'jsonwebtoken';

function login(req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    return { userId };
}

export const auth = (req, res, next) => {
    try {
        req.auth = login(req);
        next();
    } catch (error) {
        res.status(401).json(error);
    }
};
