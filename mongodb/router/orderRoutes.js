import express from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} from "../controller/orderControl.js";

const router = express.Router();

router.post('/createOrder', createOrder);
router.get('/getOrders', getOrders);
router.get('/getOrder/:id', getOrderById);
router.put('/updateOrder/:id', updateOrder);
router.delete('/deleteOrder/:id', deleteOrder);

export default router;
