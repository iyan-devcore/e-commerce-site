import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    total: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Refunded"], default: "Pending" },
    orderStatus: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
    paymentMethod: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            color: { type: String },
            size: { type: String }
        }
    ],
    address: { type: String, required: true },
    phone: { type: String }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
