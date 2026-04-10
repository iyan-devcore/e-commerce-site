import express from "express";
import { loginUser, googleLogin, registerUser, getMe, verifyEmail, resendVerificationLink } from "../controller/authcontrol.js";
import { authMiddleware } from "../utils/authmiddleware.js";
import { imageUpload } from "../controller/usercontrol.js";

const router = express.Router();

router.post('/register', imageUpload.single('imageUpload'), registerUser);
router.post('/login', loginUser);
router.post('/googleLogin', googleLogin);
router.get('/verify-email', verifyEmail);           // GET — clicked from email button
router.post('/resend-verification', resendVerificationLink);
router.get('/me', authMiddleware, getMe);

export default router;
