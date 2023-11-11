# Convergence Technical Assessment

This assessment project is a simple CRUD API for managing Todos that are stored in a database. 

## Technologies Used
- Node.js
- Express.js
- bcrypt
- JSON Web Token Authentication
- MongoDB
- Mongoose

## Assignment Detail Summary
- To request todos and submit a new todo, the user must be authenticated,
- A given todo can only be updated or deleted by the user who created it,
- A request to get todos can be filtered by:
    - todoId
    - todoTitle
    - todoTask
    - todoCreator
- The database is live and hosted on MongoDB Atlas,
- In-line comments were left to help illustrate decision making during development.

## Endpoints
### 1. login
- `POST /login`
- **Description:** Allows the user to login and recieve an authentication token.
- **Request Query:**
    ```json
    {
        "username": "<your username>",
        "password": "<your password>"
    }
    ```
- **Successful Response:** 
    ```json
    {
        "authorization": "<your JWT token>"
    }
    ```
### 2. todos
- `GET /todos`
- **Description:** Allows the the user to retrieve todos that are currently in the database. Optional parameters can be provided to filter results.
- **Request Query Parameters:**
    ```json
    {
        "(optional) todoId": "<id of desired todo>",
        "(optional) todoCreator": "<creator's username>",
        "(optional) todoTitle": "<task title>",
        "(optional) todoTask": "<task description>"
    }
    ```
- **Successful Response:** 
    ```json
    {
        "_id": "<todoId>",
        "createdBy": "<username of the todo creator>",
        "title": "<todo title>",
        "task": "<todo task>",
        "createdAt": "Date",
        "updatedAt": "Date",
    }
    ```
---
- `POST /todos`
- **Description:** Allows the use to submit a new todo entry
- **Request Query Parameters:**
    ```json
    {
        "title": "<todo title>",
        "task": "<todo task>"
    }   
    ```
- **Successful Response:**
    ```json
    {
        "_id": "<todoId>",
        "createdBy": "<username of the todo creator>",
        "title": "<todo title>",
        "task": "<todo task>",
        "createdAt": "<Date>",
        "updatedAt": "<Date>",
    }
    ```
---
- `PUT /todos`
- **Description:** Allows the user to update a todo's title or description if they are the creator of the todo. Only the provided paraameters will be updated, if none are provided the todo will not be updated.
- **Request Query Parameters:**
    ```json
    {
        "todoId": "<id of todo to update>",
        "(optional) title": "<new todo title>",
        "(optional) task": "<new todo description>"
    }
    ```
- **Successful Response:**
    ```json
    {
        "_id": "<todoId>",
        "createdBy": "<username of the todo creator>",
        "title": "<new todo title>",
        "task": "<new todo description>",
        "createdAt": "Date",
        "updatedAt": "Date",
    }
    ```
---
- `DELETE /todos`
- **Description:** Allows the user to delete a todo if they are the creator of the todo
- **Request Query Parameters:**
    ```json
    {
        "todoId": "<id of todo to delete>"
    }
    ```
- **Successful Response:**
    ```json
    {
        "success": "Todo deleted"
    }
    ```
