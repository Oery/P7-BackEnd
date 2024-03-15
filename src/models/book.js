import Mongoose from 'mongoose';

const bookSchema = new Mongoose.Schema({
    userId: String,
    title: { type: String, required: true, unique: true },
    author: String,
    imageUrl: String,
    year: Number,
    genre: String,
    ratings: [
        {
            userId: String,
            grade: Number,
        },
    ],
    averageRating: Number,
});

bookSchema.methods.getAverageRating = function () {
    let sum = 0;
    this.ratings.forEach((rating) => {
        sum += rating.grade;
    });
    this.averageRating = sum / (this.ratings.length || 1);
    return this;
};

const Book = Mongoose.model('Book', bookSchema);
export default Book;
