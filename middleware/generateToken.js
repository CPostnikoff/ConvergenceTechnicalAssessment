import jwt from "jsonwebtoken";

async function generateJWT(user) {
    try {
        const token = await jwt.sign(
            { user: user },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    } catch (error) {
        return {error: true};
    }
}

export default generateJWT;