import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";

// Same as authMiddleware but doesn't block if token is missing
export const optionalAuthMiddleware = (req, res, next) => {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
        return next(); // Guest user
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Continue as guest if token is invalid
        next();
    }
};
