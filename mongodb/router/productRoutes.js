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

router.use(authMiddleware);

router.post('/addProduct', imageUpload.array('imageUpload', 5), addProduct);
router.get('/getProducts', getProducts);
router.get('/getProduct/:id', getProductById);
router.put('/updateProduct/:id', imageUpload.array('imageUpload', 5), updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

export default router;
