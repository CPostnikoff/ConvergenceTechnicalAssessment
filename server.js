import express from 'express';
import database from './databaseConnection.js'
import bodyParser from 'body-parser';
import users from './models/usersModel.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const db = database

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './views' });
});

app.post('/login', async (req, res) => {
    console.log("login attempt");
    var {
        username,
        password
    } = req.body;
    console.log(username, password)
    const existingUser = await users.find({ username: username, password: password });
    if (existingUser) {
        res.send("Login successful")
    }
})

// app.get('/signup', (req, res) => {})

// app.get('/getTodos', (req, res) => {})

// app.post(`/deleteTodo`, (req, res) => {})

// app.post(`/updateTodo`, (req, res) => {})

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})
