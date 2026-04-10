import express from "express";
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controller/productControl.js";
import { imageUpload } from "../controller/usercontrol.js";

import { authMiddleware } from "../utils/authmiddleware.js";

const router = express.Router();

// Public routes (No authentication required)
router.get('/getProducts', getProducts);
router.get('/getProduct/:id', getProductById);

// Protected routes (Admin/Auth required)
router.post('/addProduct', authMiddleware, imageUpload.array('imageUpload', 5), addProduct);
router.put('/updateProduct/:id', authMiddleware, imageUpload.array('imageUpload', 5), updateProduct);
router.delete('/deleteProduct/:id', authMiddleware, deleteProduct);

export default router;
