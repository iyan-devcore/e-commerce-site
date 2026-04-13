import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

const Wishlist = mongoose.model("wishlist", wishlistSchema);

export default Wishlist;
