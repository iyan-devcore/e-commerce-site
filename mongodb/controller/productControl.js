import Product from "../modules/Product.js";

// Add a new product
export const addProduct = async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            discountPrice: req.body.discountPrice || 0,
            stock: req.body.stock,
            status: req.body.status || "Active",
            sku: req.body.sku,
            description: req.body.description,
            imageUpload: req.files ? req.files.map(file => file.filename) : []
        };

        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json({ message: "Product added successfully", data: savedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const productsWithImage = products.map((product) => {
            let images = [];
            if (Array.isArray(product.imageUpload)) {
                images = product.imageUpload.map(img => `http://localhost:5000/uploads/${img}`);
            } else if (product.imageUpload) {
                images = [`http://localhost:5000/uploads/${product.imageUpload}`];
            }
            return {
                ...product._doc,
                imageUpload: images
            };
        });
        res.status(200).json({ message: "Products fetched successfully", data: productsWithImage });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let images = [];
        if (Array.isArray(product.imageUpload)) {
            images = product.imageUpload.map(img => `http://localhost:5000/uploads/${img}`);
        } else if (product.imageUpload) {
            images = [`http://localhost:5000/uploads/${product.imageUpload}`];
        }

        const productWithImage = {
            ...product._doc,
            imageUpload: images
        };

        res.status(200).json({ message: "Product fetched successfully", data: productWithImage });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            discountPrice: req.body.discountPrice,
            stock: req.body.stock,
            status: req.body.status,
            sku: req.body.sku,
            description: req.body.description
        };

        if (req.files && req.files.length > 0) {
            updateData.imageUpload = req.files.map(file => file.filename);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product updated successfully", data: product });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully", data: product });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};
