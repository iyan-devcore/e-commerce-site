import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { id: 1, name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop', path: '/smartphones' },
    { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop', path: '/fashion' },
    { id: 3, name: 'Home & Living', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=200&auto=format&fit=crop', path: '/home-living' },
    { id: 4, name: 'Beauty', image: '/images/beauty_cat.png', path: '/beauty' },
    { id: 5, name: 'Accessories', image: '/images/accessories_cat.png', path: '/accessories' },
    { id: 6, name: 'Toys', image: '/images/toys_cat.png', path: '/toys' },
];

const Home = () => {
    const navigate = useNavigate();
    const [bestSellers, setBestSellers] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token || "";
                const res = await fetch(`${process.env.REACT_APP_API_URL}/product/getProducts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.data && Array.isArray(data.data)) {
                    // Shuffle the products array and pick the first 4
                    const shuffled = [...data.data].sort(() => 0.5 - Math.random());
                    setBestSellers(shuffled.slice(0, 4));
                }
                if (token) {
                    const wishRes = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const wishData = await wishRes.json();
                    if (wishData.success) {
                        setWishlist(wishData.wishlist.products.map(p => p._id || p));
                    }
                }
            } catch (error) {
                console.error('Error fetching best sellers:', error);
            }
        };
        fetchRandomProducts();
    }, []);

    const handleWishlistToggle = async (e, productId) => {
        e.stopPropagation();
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
                body: JSON.stringify({ productId })
            });
            const data = await res.json();
            if (data.success) {
                if (data.action === "added") {
                    setWishlist([...wishlist, productId]);
                } else {
                    setWishlist(wishlist.filter(id => id !== productId));
                }
            }
        } catch (error) {
            console.error("Error toggling wishlist", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <div
                className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url('/images/hero_bg.png')` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
                        Discover the Future <br /> of Shopping
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-lg drop-shadow-md">
                        Explore our latest collections with exclusive deals and premium products designed just for you.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg"
                    >
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Shop by Category</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="group cursor-pointer text-center" onClick={() => navigate(cat.path)}>
                            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl transition duration-300 transform group-hover:scale-105">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <h3 className="mt-4 font-semibold text-gray-700 group-hover:text-blue-600 transition">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Best Sellers</h2>
                        <button className="text-blue-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {bestSellers.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="h-48 overflow-hidden bg-gray-100 relative group flex justify-center items-center p-2">
                                    <img 
                                        src={(product.imageUpload && product.imageUpload.length > 0) ? product.imageUpload[0] : "https://via.placeholder.com/300?text=No+Image"} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500" 
                                        loading="lazy" 
                                    />
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                        {product.rating || 4.5} ★
                                    </div>
                                    {product.stock <= 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            Out of Stock
                                        </div>
                                    )}
                                    {/* Wishlist Heart Button */}
                                    <button 
                                        className={`absolute top-2 right-12 p-2 rounded-full shadow-sm transition-all focus:outline-none ${wishlist.includes(product._id) ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                                        onClick={(e) => handleWishlistToggle(e, product._id)}
                                    >
                                        <svg className="w-4 h-4" fill={wishlist.includes(product._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-400 text-xs tracking-wider uppercase mb-1 font-semibold">{product.category}</p>
                                    <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3">Premium Quality</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                        <button 
                                            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/product/${product._id}`);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Promo Banner */}
            <div className="container mx-auto px-4 py-12">
                <div
                    className="rounded-2xl overflow-hidden bg-cover bg-center h-64 flex items-center shadow-xl relative"
                    style={{ backgroundImage: `url('/images/promo_bg.png')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-transparent"></div>
                    <div className="relative z-10 px-8 md:px-16 text-white max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Big Summer Sale!</h2>
                        <p className="text-lg md:text-xl mb-6 font-medium">Get up to 50% off on your favorite items.</p>
                        <button className="bg-yellow-400 text-red-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition shadow-lg">
                            Grab the Deal
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { title: 'Free Shipping', desc: 'On all orders over ₹499', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                            { title: 'Secure Payment', desc: '100% secure payment', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                            { title: 'Easy Returns', desc: '7 days return policy', icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z' },
                            { title: '24/7 Support', desc: 'Dedicated support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center p-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow mb-4">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d={item.icon}></path>
                                    </svg>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
