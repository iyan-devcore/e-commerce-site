import User from "../modules/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ 
            message: "Login successful", 
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" }),
                imageUpload: user.imageUpload 
                    ? (user.imageUpload.startsWith('http') ? user.imageUpload : `http://localhost:5000/uploads/${user.imageUpload}`) 
                    : null
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { email, firstName, lastName, picture } = req.body;
        
        // Find if user already exists
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(email + Date.now().toString(), salt); // Random temp password
            
            user = new User({
                firstName: firstName || 'Google User',
                lastName: lastName || '',
                email: email,
                password: hashedPassword,
                agreeTerms: true,
                imageUpload: picture || null
            });
            await user.save();
        }

        res.status(200).json({ 
            message: "Google Login successful", 
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" }),
                imageUpload: user.imageUpload 
                    ? (user.imageUpload.startsWith('http') ? user.imageUpload : `http://localhost:5000/uploads/${user.imageUpload}`) 
                    : null
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error during Google login", error: error.message });
    }
}

export const registerUser = async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            agreeTerms: req.body.agreeTerms === 'true' || req.body.agreeTerms === true,
            imageUpload: req.file ? req.file.filename : null
        });

        const saveduser = await user.save();
        res.status(201).json({ message: "User registered successfully", data: saveduser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ 
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                imageUpload: user.imageUpload 
                    ? (user.imageUpload.startsWith('http') ? user.imageUpload : `http://localhost:5000/uploads/${user.imageUpload}`) 
                    : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
}
