import Order from "../modules/Order.js";
import { sendOrderConfirmationSMS } from "../utils/smsService.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        let items = req.body.items;
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch(e) {}
        }

        const orderData = {
            userId: req.user.id,
            customerName: req.body.customerName,
            email: req.body.email,
            phone: req.body.phone || null,
            total: req.body.total,
            paymentMethod: req.body.paymentMethod,
            items: items, // Expecting array of objects
            address: req.body.address,
            paymentStatus: req.body.paymentStatus || "Pending",
            orderStatus: req.body.orderStatus || "Processing"
        };

        const order = new Order(orderData);
        const savedOrder = await order.save();

        // Send SMS confirmation (non-blocking — failure won't break the order)
        if (req.body.phone) {
            sendOrderConfirmationSMS(req.body.phone, {
                customerName: req.body.customerName,
                orderId: savedOrder._id,
                total: req.body.total,
                itemCount: Array.isArray(items) ? items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1
            });
        }

        res.status(201).json({ message: "Order created successfully", data: savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

// Get all orders (Admin?)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ message: "Orders fetched successfully", data: orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get current user's orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Orders fetched successfully", data: orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order fetched successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

// Update order status or details
export const updateOrder = async (req, res) => {
    try {
        const updateData = {
            orderStatus: req.body.orderStatus,
            paymentStatus: req.body.paymentStatus,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order updated successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

// Cancel an order (only if Processing)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }
        if (order.orderStatus !== "Processing") {
            return res.status(400).json({ message: `Cannot cancel an order that is already ${order.orderStatus}` });
        }

        order.orderStatus = "Cancelled";
        await order.save();
        res.status(200).json({ message: "Order cancelled successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error: error.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order deleted successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};
