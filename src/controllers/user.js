import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            res.status(500).json({ err });
            return;
        }
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(() => res.json({ message: 'Utilisateur crée !' }))
            .catch((err) => res.status(400).json({ err }));
    });
};

export const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
        return;
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
            res.status(500).json({ err });
            return;
        }
        if (result) {
            res.json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }),
            });
        } else {
            res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
        }
    });
};
