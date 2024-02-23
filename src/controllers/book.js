import Book from '../models/book.js';

export const createBook = async (req, res) => {
    // TODO: Handle image upload with Multer
    // const { book, image } = req.body; // book is a string, image is a file

    // const newBook = new Book({
    //     title: req.body.title,
    //     author: req.body.author,
    //     year: req.body.year,
    //     genre: req.body.genre,
    //     userId: req.body.userId,
    //     ratings: [],
    //     averageRating: 0,
    // });
    // await newBook.save();
    res.json(newBook);
};

export const getBooks = async (_, res) => {
    const books = await Book.find();
    res.json(books);
};

export const getBook = async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        res.status(404).send('Book not found');
        return;
    }
    res.json(book);
};

export const deleteBook = async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        res.status(404).send('Book not found');
        return;
    }

    if (req.auth.userId !== book.userId) {
        res.status(403).send('Forbidden');
        return;
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
};

export const rateBook = async (req, res) => {
    const book = await Book.findById(req.params.id);

    const userRating = book.ratings.find((r) => r.userId === rating.userId);
    if (!userRating) {
        const rating = {
            userId: req.auth.userId,
            grade: req.body.rating,
        };
        book.ratings.push(rating);
    } else {
        userRating.grade = rating.rating;
    }

    book.getAverageRating();
    await book.save();
    res.send(200).send('Rating updated');
};

export const updateBook = async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        res.status(404).send('Book not found');
        return;
    }

    if (req.auth.userId !== book.userId) {
        res.status(403).send('Forbidden');
        return;
    }

    // TODO: Handle image upload with Multer
    // If image, books infos are stored as string in body.book else raw infos are stored in body

    res.send(200).send('Book updated');
};

export const getBestRating = async (_, res) => {
    // TODO: Test this route
    const result = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.json(result);
};
