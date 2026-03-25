import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Product name is required"] },
    category: { type: String, required: [true, "Category is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: [true, "Stock is required"], default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    sku: { type: String, required: [true, "SKU is required"], unique: true },
    description: { type: String, required: [true, "Description is required"] },
    imageUpload: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
