import Mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

const User = Mongoose.model('User', userSchema);
export default User;
