import express from 'express';
import database from './databaseConnection.js'
import bodyParser from 'body-parser';
import users from './models/usersModel.js'
import todos from './models/todosModel.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// User registration
app.post('/register', async (req, res) => {
    // Validate and store user information in the database
});

// User login
app.post('/login', async (req, res) => {
    // Validate user credentials
    // If valid, create a session for the user
    // Return the user a token using JWT
});

// Create a to-do item
app.post('/todos', async (req, res) => {
    // Validate input and create a to-do item for the authenticated user
    // A user must be authenticated to create a to-do item
    const { createdBy, title, task } = req.query;
    var creationDate = new Date()
    // TODO: verifiy that all the appropriate data is in the query
    const newTodoObject = {
        createdBy: createdBy,
        title: title,
        task: task,
        createdAt: creationDate,
        updatedAt: creationDate
    }

    console.log(newTodoObject);
    
    await todos.create(newTodoObject);
    // TODO: validate that the todo was created properly
    res.send("post todos reached")
});

app.get('/todos', async (req, res) => {
    // Return all to-do items
    // All todos are public
    // But the user must be authenticated to request them
    const { filterId, filterTitle, filterTaskDescription, filterUser } = req.query;
    const query = {
        ...(filterId && { _id: filterId }),
        ...(filterTitle && { title: filterTitle }),
        ...(filterTaskDescription && { task: filterTaskDescription }),
        ...(filterUser && { createdBy: filterUser }),
    }
    
    console.log(query)

    const returnedTodos = await todos.find(query);
    res.send(returnedTodos);
})

// Update a to-do item
app.put('/todos', async (req, res) => {
    // Fetch the requested todo item, 
    // If the current user is the one who crated it, update it
    // Otherwise return an error
    const { todoId, title, task } = req.query;

    try {
        const exisitingTodo = await todos.findById(todoId);
        if (exisitingTodo) {
            var updateDate = new Date();
        
            if (title) exisitingTodo.title = title;
            if (task) exisitingTodo.task = task;
        
            exisitingTodo.updatedAt = updateDate;
        }
        await exisitingTodo.save();
        res.send(exisitingTodo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

// Delete a to-do item
app.delete('/todos', async (req, res) => {
    // Fetch the requested todo item,
    // If the current user is the one who crated it, delete it
    // Otherwise return an error
    const { todoId } = req.query;
    try {
        const todo = await todos.findById(todoId);
        if (todo) {
            await todos.findByIdAndDelete(todoId);
            res.send('Todo deleted');
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})
