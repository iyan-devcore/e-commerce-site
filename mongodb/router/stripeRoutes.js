import express from 'express';
import { createPaymentIntent } from '../controller/stripeControl.js';
import { authMiddleware } from '../utils/authmiddleware.js';

const router = express.Router();

// All payment routes should be protected
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

export default router;
