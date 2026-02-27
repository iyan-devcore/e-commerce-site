import express from "express";
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controller/productControl.js";
import { imageUpload } from "../controller/usercontrol.js";

const router = express.Router();

router.post('/addProduct', imageUpload.single('imageUpload'), addProduct);
router.get('/getProducts', getProducts);
router.get('/getProduct/:id', getProductById);
router.put('/updateProduct/:id', imageUpload.single('imageUpload'), updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

export default router;
