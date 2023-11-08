import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
const { Schema } = mongoose;

const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;

const uri = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority`

mongoose.connect(uri);
const database = mongoose.connection;

// const todo = new Schema({
//     title: String,
//     category: String,
//     author: String,
// })

// const user = new Schema({
//     username: String,
//     password: String,
// })

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})
