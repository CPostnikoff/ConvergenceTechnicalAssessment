import jwt from "jsonwebtoken";
import createErrorResponse from '../middleware/createErrorResponse.js';

function verifyToken(req, res, next) {
    // check to see if there is an authorization header containing a JWT
    const token = req.headers.authorization;
    if (!token) {
        return createErrorResponse(res, 401, 'Unauthorized request');
    }
    try {
        // If there is a JWT, verify that it matches using the secret key
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return createErrorResponse(res, 500, 'Failed to authenticate token');
            }
            // If the JWT is valid, continue with the request and store the user's information in the req object
            req.user = decoded;
            next();
        })
    } catch (error) {
        return createErrorResponse(res, 401, 'Invalid token');
    }
}

export default verifyToken
