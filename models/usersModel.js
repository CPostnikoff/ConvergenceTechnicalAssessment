import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    accessToken: String,
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
