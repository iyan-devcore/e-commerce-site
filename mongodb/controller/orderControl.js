import Order from "../modules/Order.js";
import Product from "../modules/Product.js";
import { sendOrderConfirmationSMS } from "../utils/smsService.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        let items = req.body.items;
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch(e) {}
        }

        // --- Stock Validation ---
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}` });
            }
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
            orderStatus: req.body.orderStatus || "Processing",
            stripePaymentId: req.body.stripePaymentId || null
        };


        const order = new Order(orderData);
        const savedOrder = await order.save();

        // --- Decrement Stock ---
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

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
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Rule: If order is already cancelled or delivered, status cannot be changed
        if (order.orderStatus === "Cancelled" || order.orderStatus === "Delivered") {
            return res.status(400).json({ message: `Cannot update an order that is already ${order.orderStatus}` });
        }


        // Rule: Admin cannot set status to Cancelled (Only users can)
        if (req.body.orderStatus === "Cancelled") {
            return res.status(400).json({ message: "Administrators cannot cancel orders. Only users can cancel their own orders." });
        }

        const updateData = {
            orderStatus: req.body.orderStatus,
            paymentStatus: req.body.paymentStatus,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
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

        // --- Replenish Stock ---
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity }
            });
        }
        res.status(200).json({ message: "Order cancelled successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error: error.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Rule: Admin can only delete orders that are cancelled or delivered
        if (order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered") {
            return res.status(400).json({ 
                message: `Cannot delete an active order. Order must be 'Cancelled' or 'Delivered' first. Current status: ${order.orderStatus}` 
            });
        }

        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Order deleted successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};

