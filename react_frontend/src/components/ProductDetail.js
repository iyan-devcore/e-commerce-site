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

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [myReviewId, setMyReviewId] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    // Recommendations
    const [recommendations, setRecommendations] = useState([]);
    const [recsLoading, setRecsLoading] = useState(false);

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

    // Fetch reviews whenever product id changes
    useEffect(() => {
        if (!id) return;
        const fetchReviews = async () => {
            setReviewsLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/review/${id}`);
                const data = await res.json();
                if (data.success) {
                    setReviews(data.data);
                    setAvgRating(data.avgRating);
                    if (loggedInUser) {
                        const mine = data.data.find(r => r.user === loggedInUser.id);
                        if (mine) setMyReviewId(mine._id);
                    }
                }
            } catch (e) {
                console.error('Failed to load reviews', e);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fetch recommendations whenever product id changes
    useEffect(() => {
        if (!id) return;
        const fetchRecs = async () => {
            setRecsLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/recommendations/${id}?limit=6`);
                const data = await res.json();
                if (data.success) setRecommendations(data.data);
            } catch (e) {
                console.error('Failed to load recommendations', e);
            } finally {
                setRecsLoading(false);
            }
        };
        fetchRecs();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        if (!loggedInUser) { navigate('/login'); return; }
        if (newRating === 0) { setSubmitError('Please select a star rating.'); return; }
        if (!newComment.trim()) { setSubmitError('Please write a comment.'); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/review/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedInUser.token}`
                },
                body: JSON.stringify({ rating: newRating, comment: newComment })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSubmitSuccess('Your review has been posted!');
                setReviews(prev => [data.data, ...prev]);
                setAvgRating(prev => {
                    const total = reviews.length * prev + newRating;
                    return parseFloat((total / (reviews.length + 1)).toFixed(1));
                });
                setMyReviewId(data.data._id);
                setNewRating(0);
                setNewComment('');
            } else {
                setSubmitError(data.message || 'Could not post review.');
            }
        } catch (err) {
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!myReviewId) return;
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/review/${myReviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${loggedInUser.token}` }
            });
            const data = await res.json();
            if (data.success) {
                setReviews(prev => prev.filter(r => r._id !== myReviewId));
                setMyReviewId(null);
                setSubmitSuccess('');
            }
        } catch (err) {
            console.error('Error deleting review', err);
        }
    };

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
                            <div className="animate-fadeIn">
                                {/* Rating Summary */}
                                <div className="flex items-center gap-6 mb-8 p-5 bg-gray-50 rounded-xl">
                                    <div className="text-center">
                                        <p className="text-5xl font-extrabold text-gray-900">{avgRating || '—'}</p>
                                        <div className="flex justify-center gap-0.5 mt-1">
                                            {[1,2,3,4,5].map(s => (
                                                <svg key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        {[5,4,3,2,1].map(star => {
                                            const count = reviews.filter(r => r.rating === star).length;
                                            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="w-4 text-right">{star}</span>
                                                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                        <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="w-6">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Write a Review Form */}
                                {loggedInUser && !myReviewId && (
                                    <form onSubmit={handleSubmitReview} className="mb-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
                                        <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
                                        {/* Star Picker */}
                                        <div className="flex items-center gap-1 mb-3">
                                            {[1,2,3,4,5].map(s => (
                                                <button type="button" key={s}
                                                    onMouseEnter={() => setHoverRating(s)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setNewRating(s)}
                                                    className="focus:outline-none"
                                                >
                                                    <svg className={`w-8 h-8 transition-colors ${s <= (hoverRating || newRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                    </svg>
                                                </button>
                                            ))}
                                            {newRating > 0 && <span className="ml-2 text-sm text-gray-500">{['','Poor','Fair','Good','Very Good','Excellent'][newRating]}</span>}
                                        </div>
                                        <textarea
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            placeholder="Share your experience with this product..."
                                            rows={3}
                                            className="w-full border border-blue-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                        />
                                        {submitError   && <p className="text-red-500 text-xs mt-1">{submitError}</p>}
                                        {submitSuccess && <p className="text-green-600 text-xs mt-1">{submitSuccess}</p>}
                                        <button type="submit" disabled={submitting}
                                            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                                        >
                                            {submitting ? 'Posting…' : 'Post Review'}
                                        </button>
                                    </form>
                                )}
                                {!loggedInUser && (
                                    <div className="mb-6 bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-sm text-gray-500">
                                        <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">Log in</button> to leave a review.
                                    </div>
                                )}

                                {/* Reviews List */}
                                {reviewsLoading ? (
                                    <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <p className="text-4xl mb-2">💬</p>
                                        <p className="font-medium">No reviews yet. Be the first!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {reviews.map(review => (
                                            <div key={review._id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                                                            {review.userName?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-gray-900 text-sm">{review.userName}</span>
                                                                {review.verified && (
                                                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-100">
                                                                        ✓ Verified Buyer
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-0.5">
                                                            {[1,2,3,4,5].map(s => (
                                                                <svg key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        {myReviewId === review._id && (
                                                            <button onClick={handleDeleteReview} className="text-xs text-red-400 hover:text-red-600 transition ml-1" title="Delete my review">
                                                                🗑
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Products You May Also Like ─────────────────────── */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Products You May Also Like</h2>
                            <p className="text-sm text-gray-500 mt-1">Recommended based on purchase patterns</p>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI Powered
                        </span>
                    </div>

                    {recsLoading ? (
                        /* Shimmer skeleton */
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                    <div className="aspect-square bg-gray-200" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                            <p className="text-sm">No recommendations yet — start shopping to unlock personalised picks!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {recommendations.map(rec => (
                                <Link
                                    key={rec._id}
                                    to={`/product/${rec._id}`}
                                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                                >
                                    {/* Image */}
                                    <div className="aspect-square bg-gray-50 overflow-hidden">
                                        <img
                                            src={rec.image || 'https://placehold.co/300x300?text=No+Image'}
                                            alt={rec.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Info */}
                                    <div className="p-3">
                                        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{rec.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            {rec.discountPrice && rec.discountPrice > 0 ? (
                                                <>
                                                    <span className="text-sm font-bold text-gray-900">₹{rec.discountPrice}</span>
                                                    <span className="text-xs text-gray-400 line-through">₹{rec.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-900">₹{rec.price}</span>
                                            )}
                                        </div>
                                        <span className="mt-2 inline-block text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium capitalize">{rec.category}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default ProductDetail;
