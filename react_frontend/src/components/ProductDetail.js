import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// --- Dummy Data ---
const dummyProduct = {
    id: 1,
    title: "Premium Wireless Noise-Cancelling Headphones",
    brand: "Sony",
    rating: 4.8,
    reviewCount: 256,
    price: 349.99,
    discountPrice: 299.99,
    stockParams: {
        status: "In Stock",
        quantity: 15
    },
    shortDescription: "Experience industry-leading noise cancellation, exceptional sound quality, and all-day comfort with these premium headphones.",
    description: "Immerse yourself in music with our industry-leading noise cancellation technology. These headphones feature a premium design, long battery life, and smart listening technology that automatically adjusts your ambient sound settings.",
    specifications: [
        { label: "Battery Life", value: "30 hours" },
        { label: "Weight", value: "254g" },
        { label: "Bluetooth", value: "5.0" },
        { label: "Driver Unit", value: "40mm, Dome type" },
        { label: "Connectors", value: "USB-C, 3.5mm jack" }
    ],
    images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1572569028738-411a54fb142a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524678606375-71c3ae099eb1?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
    ],
    colors: [
        { name: 'Black', value: '#000000', inStock: true },
        { name: 'Silver', value: '#C0C0C0', inStock: true },
        { name: 'Blue', value: '#0000FF', inStock: false }
    ],
    sizes: [
        { name: 'Standard', inStock: true },
        { name: 'XL Earpads', inStock: true }
    ],
    reviews: [
        { id: 1, user: "John Doe", rating: 5, comment: "Amazing sound quality!", date: "2023-10-15" },
        { id: 2, user: "Jane Smith", rating: 4, comment: "Great, but a bit pricey.", date: "2023-10-20" },
    ],
    relatedProducts: [
        { id: 2, title: "Wireless Earbuds", price: 129.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop" },
        { id: 3, title: "Smart Speaker", price: 89.99, image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop" },
        { id: 4, title: "Bluetooth Adapter", price: 29.99, image: "https://images.unsplash.com/photo-1563770095-39d69aa23756?q=80&w=1000&auto=format&fit=crop" }
    ]
};

// --- SVG Icons ---
const StarIcon = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const HeartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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
    // In a real app, fetch functionality based on ID would be here
    const product = dummyProduct;

    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [zoomStyle, setZoomStyle] = useState({});

    useEffect(() => {
        // Reset selection on product change
        setSelectedImage(product.images[0]);
        setSelectedColor(product.colors[0]);
        setSelectedSize(product.sizes[0]);
        setQuantity(1);
    }, [product]);

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

    const discountPercentage = Math.round(((product.price - product.discountPrice) / product.price) * 100);

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
                            <span className="text-3xl font-bold text-gray-900">${product.discountPrice}</span>
                            <span className="text-xl text-gray-400 line-through mb-1">${product.price}</span>
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
                            <button className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                                <ShoppingCartIcon />
                                Add to Cart
                            </button>

                            {/* Wishlist Button */}
                            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                                <HeartIcon />
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
                                    <p className="text-gray-500 text-sm mt-1">${rel.price}</p>
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
