import User from "../modules/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "../secret.js";
import { sendVerificationLink } from "../utils/emailService.js";

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

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email to continue", unverifiedEmail: user.email });
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
        
        let user = await User.findOne({ email });
        
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(email + Date.now().toString(), salt);
            
            user = new User({
                firstName: firstName || 'Google User',
                lastName: lastName || '',
                email: email,
                password: hashedPassword,
                agreeTerms: true,
                imageUpload: picture || null,
                isVerified: true  // Google accounts are pre-verified
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
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Generate a secure random token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            agreeTerms: req.body.agreeTerms === 'true' || req.body.agreeTerms === true,
            imageUpload: req.file ? req.file.filename : null,
            verificationToken: verificationToken,
            verificationTokenExpires: tokenExpiry,
            isVerified: false
        });

        await user.save();
        
        // Build verification URL pointing to the React frontend
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
        
        console.log(`[DEV] Verification URL for ${user.email}: ${verificationUrl}`);
        await sendVerificationLink(user.email, verificationUrl);

        res.status(201).json({ message: "Registration successful! Please check your email to verify your account.", data: { email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;
        
        if (!token || !email) {
            return res.status(400).json({ message: "Invalid verification link" });
        }

        const user = await User.findOne({ email: decodeURIComponent(email) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(200).json({ message: "Email already verified", alreadyVerified: true });
        }

        if (user.verificationToken !== token) {
            return res.status(400).json({ message: "Invalid or expired verification link" });
        }

        if (user.verificationTokenExpires < new Date()) {
            return res.status(400).json({ message: "Verification link has expired. Please request a new one." });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        res.status(200).json({ 
            message: "Email verified successfully! You can now log in.",
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
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
}

export const resendVerificationLink = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified" });
        }

        // Generate fresh token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;

        console.log(`[DEV] Resent verification URL for ${user.email}: ${verificationUrl}`);
        await sendVerificationLink(user.email, verificationUrl);

        res.status(200).json({ message: "A new verification link has been sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Error resending verification link", error: error.message });
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
