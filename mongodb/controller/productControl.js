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

// Get products — supports ?page=1&limit=12&search=&category=&sort=&inStock=true
export const getProducts = async (req, res) => {
    try {
        const {
            page     = 1,
            limit    = 12,
            search   = '',
            category = '',
            sort     = '',
            inStock  = '',
        } = req.query;

        const pageNum  = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // cap at 100
        const skip     = (pageNum - 1) * limitNum;

        // Build filter
        const filter = {};
        if (search)   filter.name     = { $regex: search,   $options: 'i' };
        if (category) filter.category = { $regex: category, $options: 'i' };
        if (inStock === 'true') filter.stock = { $gt: 0 };

        // Build sort
        const sortMap = {
            'price_asc':  { price: 1 },
            'price_desc': { price: -1 },
            'newest':     { createdAt: -1 },
            'oldest':     { createdAt: 1 },
        };
        const sortOption = sortMap[sort] || { createdAt: -1 };

        const [products, total] = await Promise.all([
            Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
            Product.countDocuments(filter),
        ]);

        // Normalize image URLs
        const formatImage = (img) =>
            img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`;

        const productsWithImage = products.map((product) => ({
            ...product._doc,
            imageUpload: Array.isArray(product.imageUpload)
                ? product.imageUpload.map(formatImage)
                : product.imageUpload
                    ? [formatImage(product.imageUpload)]
                    : [],
        }));

        res.status(200).json({
            message: "Products fetched successfully",
            data:        productsWithImage,
            total,
            page:        pageNum,
            limit:       limitNum,
            totalPages:  Math.ceil(total / limitNum),
            hasNextPage: pageNum < Math.ceil(total / limitNum),
            hasPrevPage: pageNum > 1,
        });
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
            images = product.imageUpload.map(img => img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`);
        } else if (product.imageUpload) {
            images = product.imageUpload.startsWith('http') ? [product.imageUpload] : [`http://localhost:5000/uploads/${product.imageUpload}`];
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
