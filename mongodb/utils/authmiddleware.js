import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";

export const authMiddleware = (req, res, next) => {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Please login to access this API" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};