import User from "../modules/Users.js";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret.js";

export const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads')
        },

        filename: function (req, file, cb) {
            cb(null, file.fieldname + "_" + Date.now() + ".jpg")
        }
    })
})

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
                imageUpload: user.imageUpload 
                    ? (user.imageUpload.startsWith('http') ? user.imageUpload : `http://localhost:5000/uploads/${user.imageUpload}`) 
                    : null
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error during Google login", error: error.message });
    }
}

export const addUser = async (req, res) => {
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

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        const userwithimage = users.map((user) => {
            return {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                agreeTerms: user.agreeTerms,
                createdAt: user.createdAt,
                imageUpload: user.imageUpload 
                    ? (user.imageUpload.startsWith('http') ? user.imageUpload : `http://localhost:5000/uploads/${user.imageUpload}`) 
                    : null
            }
        })
        res.status(200).json({ message: "Users fetched successfully", data: userwithimage });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        };

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.body.agreeTerms !== undefined) {
            updateData.agreeTerms = req.body.agreeTerms === 'true' || req.body.agreeTerms === true;
        }

        if (req.file) {
            updateData.imageUpload = req.file.filename;
        }

        // Remove undefined fields so they don't overwrite existing data 
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
}

export const searchUser = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).json({ message: "No search keyword provided" });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } }
            ]
        });
        res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}