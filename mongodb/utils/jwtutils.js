import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";

export const generateToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
};
