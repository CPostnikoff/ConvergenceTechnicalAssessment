import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('No token provided');
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(500).send('Failed to authenticate token');
            }
            req.user = decoded;
            next();
        })
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
}

export default verifyToken
