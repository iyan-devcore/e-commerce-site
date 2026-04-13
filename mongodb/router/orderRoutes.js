import express from "express";
import {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrder,
    cancelOrder,
    deleteOrder
} from "../controller/orderControl.js";
import { imageUpload } from "../controller/usercontrol.js";

import { authMiddleware } from "../utils/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post('/createOrder', imageUpload.none(), createOrder);
router.get('/getOrders', getOrders);
router.get('/myorders', getMyOrders);
router.get('/getOrder/:id', getOrderById);
router.put('/updateOrder/:id', imageUpload.none(), updateOrder);
router.put('/cancelOrder/:id', cancelOrder);
router.delete('/deleteOrder/:id', deleteOrder);

export default router;
