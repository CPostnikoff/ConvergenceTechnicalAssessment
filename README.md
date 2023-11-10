# Convergence Technical Assessment

This assessment project is a simple CRUD API for managing Todos that are stored in a database. 

## Technologies Used
- Node.js
- Express.js
- bcrypt
- JSON Web Token Authentication
- MongoDB
- Mongoose

## Details
- To request todos and submit a new todo, the user must be authenticated,
- A given todo can only be updated or delted by the user who created it,
- A request to get todos can be filtered by:
    - todoId
    - todoTitle
    - todoTask
    - todoCreator
- The database is live and hosted on MongoDB Atlas,
- In-line comments were left to help illustrate decision making during development.