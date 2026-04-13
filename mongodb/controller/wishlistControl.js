import Wishlist from "../modules/Wishlist.js";
import Product from "../modules/Product.js";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        const productIndex = wishlist.products.indexOf(productId);
        
        if (productIndex > -1) {
            // Product exists, remove it
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            return res.status(200).json({ success: true, message: "Removed from wishlist", action: "removed", wishlist });
        } else {
            // Product doesn't exist, add it
            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ success: true, message: "Added to wishlist", action: "added", wishlist });
        }

    } catch (error) {
        console.error("Error toggling wishlist:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
        
        if (!wishlist) {
            return res.status(200).json({ success: true, wishlist: { products: [] } });
        }

        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
