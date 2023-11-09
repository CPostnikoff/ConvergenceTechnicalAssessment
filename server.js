import express, { query } from 'express';
import database from './databaseConnection.js'
import bodyParser from 'body-parser';
import users from './models/usersModel.js'
import todos from './models/todosModel.js'
import bcrypt from "bcrypt";
import verifyToken from './middleware/verifyToken.js';
import generateJWT from './middleware/generateToken.js';
import todoFiltering from './middleware/todoFiltering.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/login', async (req, res) => {
    // Extract username and password from the request body (assuming they are in the request body, not query parameters)
    const { username, password } = req.query;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const foundUser = await users.findOne({ username });

        if (!foundUser) {
            return res.status(402).send('Invalid credentials');
        }

        const correctPassword = await bcrypt.compare(password, foundUser.password);

        if (correctPassword === true) {
            const token = await generateJWT(foundUser.username);
            res.send(token);
        } else {
            return res.status(402).send('Invalid credentials');
        }

    } catch (error) {
        return res.status(500).send('Error occured within login');
    }
});


// Create a to-do item
app.post('/todos', verifyToken, async (req, res) => {
    // Validate input and create a to-do item for the authenticated user
    // A user must be authenticated to create a to-do item
    const { title, task } = req.query;
    // TODO: verifiy that all the appropriate data is in the query

    if (req.user) {
        if (!title || !task) { 
            res.status(400).send("Todo's require both a title and task are required")
        } 
        var creationDate = new Date()
        const newTodoObject = {
            createdBy: req.user.user,
            title: title,
            task: task,
            createdAt: creationDate,
            updatedAt: creationDate
        }
        await todos.create(newTodoObject);
        res.send(newTodoObject);
    } else {
        res.status(401).send("Unauthorized to create a todo")
    }
});

app.get('/todos', verifyToken, async (req, res) => {
    // Return all to-do items
    // All todos are public
    // But the user must be authenticated to view them
    
    const query = todoFiltering(req.query);

    if (req.user) {
        try {
            const returnedTodos = await todos.find(query);
            res.send(returnedTodos);
        } catch (error) {
            res.status(500).send('Error fetching todos');
        }
    } else {
        res.status(401).send("Unauthorized to view todos")
    }
})

// Update a to-do item
app.put('/todos', verifyToken, async (req, res) => {
    // Fetch the requested todo item, 
    // If the current user is the one who created it, update it
    // Otherwise return an error
    const { todoId, title, task } = req.query;
    try {
        const existingTodo = await todos.findById(todoId);
        if (existingTodo) {
            if (req.user.user == existingTodo.createdBy) {
                var updateDate = new Date();
                if (title) existingTodo.title = title;
                if (task) existingTodo.task = task;
                existingTodo.updatedAt = updateDate;
                await existingTodo.save();
                res.send(existingTodo);
            } else {
                res.status(401).send('Unauthorized for editing of this todo');
            }
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching todos');
    }
});

// Delete a to-do item
app.delete('/todos', verifyToken, async (req, res) => {
    // Fetch the requested todo item,
    // If the current user is the one who created it, delete it
    // Otherwise return an error
    const { todoId } = req.query;
    try {
        const todo = await todos.findById(todoId);
        if (todo) {
            if (req.user.user == todo.createdBy) {
            await todos.findByIdAndDelete(todoId);
            res.send('Todo deleted');
            } else {
                res.status(401).send('Unauthorized for deletion of this todo');
            }
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching todos');
    }
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})
