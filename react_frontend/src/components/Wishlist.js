import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            fetchWishlist(parsedUser.token);
        }
    }, [navigate]);

    const fetchWishlist = async (token) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.wishlist) {
                setWishlist(data.wishlist.products);
            }
        } catch (error) {
            console.error("Error fetching wishlist", error);
        } finally {
            setLoadingWishlist(false);
        }
    };

    const handleRemoveFromWishlist = async (e, productId) => {
        e.stopPropagation();
        const token = JSON.parse(localStorage.getItem('user'))?.token;
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
            if (data.success && data.action === "removed") {
                setWishlist(wishlist.filter(p => p._id !== productId));
            }
        } catch (error) {
            console.error("Error toggling wishlist", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-gray-500 mt-2">Manage your saved products</p>
                </div>

                {loadingWishlist ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't saved any items yet. Start shopping and adding your favorite products!</p>
                        <button 
                            onClick={() => navigate('/shop')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map(product => (
                            <div 
                                key={product._id} 
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group flex flex-col h-full relative"
                            >
                                <button 
                                    onClick={(e) => handleRemoveFromWishlist(e, product._id)}
                                    className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-full shadow-sm transition-all z-10"
                                    title="Remove from wishlist"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                <div className="h-56 overflow-hidden bg-gray-50 relative flex justify-center items-center p-4">
                                    <img 
                                        src={(product.imageUpload && product.imageUpload.length > 0) ? product.imageUpload[0] : "https://via.placeholder.com/300?text=No+Image"} 
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <p className="text-gray-400 text-xs tracking-wider uppercase mb-1 font-semibold">{product.category}</p>
                                    <h3 className="font-bold text-gray-800 text-md mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                    
                                    <div className="mt-auto">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                                            <button 
                                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm font-medium text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/product/${product._id}`);
                                                }}
                                            >
                                                View Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
