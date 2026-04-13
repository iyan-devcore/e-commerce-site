import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';


// --- SVG Icons ---
const StarIcon = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const ShoppingCartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);


const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [zoomStyle, setZoomStyle] = useState({});

    const handleAddToCart = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(storedUser);
        const cartKey = `cart_${user.id}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        
        // Find if item already exists in cart with same color and size
        const existingItemIndex = cart.findIndex(item => 
            item.product._id === product._id && 
            (item.color && selectedColor ? item.color.name === selectedColor.name : true) && 
            (item.size && selectedSize ? item.size.name === selectedSize.name : true)
        );
        
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                product: product,
                color: selectedColor,
                size: selectedSize,
                quantity: quantity
            });
        }
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        window.alert("Product added to your cart!");
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const token = JSON.parse(localStorage.getItem('user'))?.token || "";
                const response = await fetch(`${process.env.REACT_APP_API_URL}/product/getProduct/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const result = await response.json();
                
                const productData = result.data;
                const formattedProduct = {
                    ...productData,
                    title: productData.name,
                    images: productData.imageUpload?.length > 0 ? productData.imageUpload : ["https://placehold.co/600x600?text=No+Image"],
                    brand: productData.category || "Unbranded",
                    rating: 4.5,
                    reviewCount: 150,
                    stockParams: { status: productData.status, quantity: productData.stock },
                    shortDescription: productData.description ? productData.description.substring(0, 100) + '...' : '',
                    colors: [
                        { name: 'Default', value: '#000000', inStock: true }
                    ],
                    sizes: [
                        { name: 'Standard', inStock: true }
                    ],
                    specifications: [
                        { label: "Category", value: productData.category },
                        { label: "SKU", value: productData.sku },
                        { label: "Stock", value: productData.stock }
                    ],
                    reviews: [],
                    relatedProducts: []
                };

                setProduct(formattedProduct);
                setSelectedImage(formattedProduct.images[0]);
                setSelectedColor(formattedProduct.colors[0]);
                setSelectedSize(formattedProduct.sizes[0]);

                // Also check if it's in wishlist if logged in
                if (token) {
                    const wishRes = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const wishData = await wishRes.json();
                    if (wishData.success && wishData.wishlist.products.some(p => p._id === id || p === id)) {
                        setIsInWishlist(true);
                    }
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2)' // Zoom level
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)'
        });
    };

    const handleWishlistToggle = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const token = JSON.parse(storedUser).token;
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/toggle`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product._id })
            });
            const data = await res.json();
            if (data.success) {
                setIsInWishlist(data.action === "added");
            }
        } catch (error) {
            console.error("Error toggling wishlist", error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading product details...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Product not found.</div>;

    const discountPercentage = product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="bg-gray-50 min-h-screen py-8 text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-gray-500">
                    <Link to="/" className="hover:text-gray-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/electronics" className="hover:text-gray-900">Electronics</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.title}</span>
                </nav>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Left Column: Image Gallery */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-zoom-in"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={selectedImage}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                                style={zoomStyle}
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    -{discountPercentage}%
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                        {/* Header */}
                        <div>
                            <h2 className="text-sm font-semibold text-blue-600 tracking-wide uppercase">{product.brand}</h2>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{product.title}</h1>

                            {/* Rating */}
                            <div className="flex items-center mt-3 gap-2">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} filled={i < Math.floor(product.rating)} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-gray-900">₹{product.discountPrice}</span>
                            <span className="text-xl text-gray-400 line-through mb-1">₹{product.price}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                            {product.shortDescription}
                        </p>

                        <div className="h-px bg-gray-200 my-2"></div>

                        {/* Variants */}
                        <div className="space-y-6">
                            {/* Color Selector */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor.name}</span></h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => color.inStock && setSelectedColor(color)}
                                            disabled={!color.inStock}
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor.name === color.name ? 'border-blue-600 ring-2 ring-blue-100 scale-110' : 'border-gray-200'} ${!color.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        >
                                            {selectedColor.name === color.name && (
                                                <CheckIcon /> // Checkmark for visibility on dark colors, might need contrast logic
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Size: <span className="text-gray-500 font-normal">{selectedSize.name}</span></h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size.name}
                                            onClick={() => size.inStock && setSelectedSize(size)}
                                            disabled={!size.inStock}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize.name === size.name ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'} ${!size.inStock ? 'opacity-40 bg-gray-50 cursor-not-allowed decoration-slice' : ''}`}
                                        >
                                            {size.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                <ShoppingCartIcon />
                                Add to Cart
                            </button>

                            {/* Wishlist Button */}
                            <button 
                                onClick={handleWishlistToggle}
                                className={`p-3 border rounded-lg transition-colors ${isInWishlist ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Security/Trust */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <span>Secure Transaction</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                <span>Free Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Tabs */}
                <div className="mt-16 bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
                        {['description', 'specifications', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-600">
                        {activeTab === 'description' && (
                            <div className="animate-fadeIn">
                                <p>{product.description}</p>
                                <p className="mt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="animate-fadeIn">
                                <table className="w-full text-left text-sm">
                                    <tbody>
                                        {product.specifications.map((spec, i) => (
                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                <td className="py-3 font-medium text-gray-900 w-1/3">{spec.label}</td>
                                                <td className="py-3 text-gray-600">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6 animate-fadeIn">
                                {product.reviews.map(review => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-gray-900">{review.user}</div>
                                            <div className="text-xs text-gray-500">{review.date}</div>
                                        </div>
                                        <div className="flex text-yellow-400 text-xs mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} filled={i < review.rating} />
                                            ))}
                                        </div>
                                        <p className="text-sm">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {product.relatedProducts.map(rel => (
                            <div key={rel.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-gray-900 font-medium truncate">{rel.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">₹{rel.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;
