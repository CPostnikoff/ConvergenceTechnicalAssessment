import express, { query } from 'express';
import database from './databaseConnection.js';
import bodyParser from 'body-parser';
import users from './models/usersModel.js';
import todos from './models/todosModel.js';
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
    const { username, password } = req.query;

    // Validate that the user has provided a username and password
    if (!username || !password) {
        return res.status(400).send({error: 'Username and password are required'});
    }

    try {
        // Check to see if the user exists in the users collection
        const foundUser = await users.findOne({ username });

        if (!foundUser) {
            return res.status(402).send({error: 'Invalid credentials'});
        }

        // If the user exists, check to see if the password matches
        try {
            const correctPassword = await bcrypt.compare(password, foundUser.password);

            if (correctPassword === true) {
                // If the password is a match, return a JWT
                const token = await generateJWT(foundUser.username);
                res.send(token);
            } else {
                return res.status(402).send({error: 'Invalid credentials'});
            }
        } catch (error) {
            return res.status(500).send({error: 'Error with user validation'});
        }     

    } catch (error) {
        return res.status(500).send({error: 'Error occured within login'});
    }
});

app.post('/todos', verifyToken, async (req, res) => {
    // If the user is authenticated, continue with creating a new todo
    if (req.user) {
        const { title, task } = req.query;
        // Check to make sure the user has provided a title and a task for the todo
        if (!title || !task) {
            res.status(400).send({error: "Todo's require both a title and task are required"})
        }
        const creationDate = new Date();
        const createdBy = req.user.user;

        const newTodoObject = {
            createdBy,
            title,
            task,
            createdAt: creationDate,
            updatedAt: creationDate
        };

        try {
            await todos.create(newTodoObject);
            res.send(newTodoObject);
        } catch (error) {
            res.status(500).send({error: 'Error creating todo'});
        }
    } else {
        res.status(401).send({error: "Unauthorized to create a todo"});
    }
});

// get all to-do items
app.get('/todos', verifyToken, async (req, res) => {
    // All todos are public, but only authenticated users may view them

    // Customize the search query based on query parameters
    const query = todoFiltering(req.query);

    if (req.user) {
        try {
            const returnedTodos = await todos.find(query);
            res.send(returnedTodos);
        } catch (error) {
            res.status(500).send('Error fetching todos');
        }
    } else {
        res.status(401).send({error: "Unauthorized to view todos"});
    }
})

// Update a to-do item
app.put('/todos', verifyToken, async (req, res) => {
    // Fetch the requested todo item
    // If the current user is the one who created it, update it

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
                res.status(401).send({error: 'You are not authorized to edit this todo'});
            }
        } else {
            res.status(404).send({error: 'Todo not found'});
        }
    } catch (error) {
        res.status(500).send({error: 'Error fetching todos'});
    }
});

// Delete a to-do item
app.delete('/todos', verifyToken, async (req, res) => {
    // Fetch the requested todo item by id
    // If the user making the delete request is the creator, delete it
    const { todoId } = req.query;
    try {
        const todo = await todos.findById(todoId);
        if (todo) {
            if (req.user.user == todo.createdBy) {
                await todos.findByIdAndDelete(todoId);
                res.send('Todo deleted');
            } else {
                res.status(401).send({error: 'Unauthorized for deletion of this todo'});
            }
        } else {
            res.status(404).send({error: 'Todo not found'});
        }
    } catch (error) {
        res.status(500).send({error: 'Error fetching todos'});
    }
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})
