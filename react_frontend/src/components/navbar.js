import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    
    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    const updateCartCount = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const items = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
            const count = items.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        } else {
            setCartCount(0);
        }
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        
        // Fetch all products for search filtering
        const fetchProducts = async () => {
            const token = JSON.parse(localStorage.getItem('user'))?.token || "";
            if (!token) return;
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/product/getProducts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.data) {
                    setAllProducts(data.data);
                }
            } catch(e) {
                console.error("Search fetch error", e);
            }
        };
        fetchProducts();
        
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    // Instant Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const lowerQ = searchQuery.toLowerCase();
        const filtered = allProducts.filter(p => 
            (p.name && p.name.toLowerCase().includes(lowerQ)) || 
            (p.title && p.title.toLowerCase().includes(lowerQ))
        );
        setSearchResults(filtered.slice(0, 5)); // Keep dropdown clean with top 5
    }, [searchQuery, allProducts]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white lg:bg-white/70 lg:backdrop-blur-md border-b border-gray-200 shadow-sm h-[70px]">
            <div className="h-full px-4 md:px-10 flex items-center justify-between container mx-auto">
                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isMenuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                        T
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                        TechStore
                    </span>
                </Link>

                {/* Navigation Links - Desktop */}
                <ul className="hidden lg:flex items-center gap-8">
                    {['Home', 'Shop', 'Smartphones', 'Laptops', 'Audio'].map((item) => (
                        <li key={item}>
                            <Link
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="relative py-2 text-[15px] font-medium text-gray-500 hover:text-blue-600 transition-colors group"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full rounded-full"></span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Search and Icons */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Search Bar - Hidden on small screens */}
                    <div className="relative hidden md:block z-50">
                        <div className={`flex items-center bg-gray-100 rounded-full px-4 py-2 transition-all duration-300 ease-out border border-transparent ${isSearchFocused ? 'w-[350px] bg-white ring-2 ring-blue-100 shadow-md border-blue-500' : 'w-[260px] hover:bg-gray-200 hover:w-[280px]'}`}>
                            <svg className={`w-5 h-5 transition-colors duration-200 mr-2 ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay so click on result works
                                className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setIsSearchFocused(true); }} className="text-gray-400 hover:text-gray-600 transition-colors ml-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                        </div>
                        
                        {/* Search Results Dropdown Drop */}
                        <div className={`absolute top-full right-0 mt-3 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top transform ${isSearchFocused && searchQuery ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
                            {searchResults.length > 0 ? (
                                <div className="py-2 flex flex-col">
                                    {searchResults.map((product) => (
                                        <div 
                                            key={product._id} 
                                            onClick={() => { navigate(`/product/${product._id}`); setSearchQuery(''); setIsSearchFocused(false); }}
                                            className="flex items-center px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                                                <img 
                                                    src={product.images ? product.images[0] : (product.imageUpload ? product.imageUpload[0] : 'https://via.placeholder.com/50')} 
                                                    alt={product.name || product.title} 
                                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name || product.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                                            </div>
                                            <div className="font-bold text-sm text-gray-900">
                                                ₹{product.discountPrice || product.price}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-100">
                                        <span className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors w-full inline-block" onClick={() => { navigate('/shop'); setSearchQuery(''); setIsSearchFocused(false); }}>
                                            View all matching results
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-1 text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200" aria-label="Wishlist">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>

                        <Link to={localStorage.getItem('user') ? "/cart" : "/login"} className="relative p-1 text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200" aria-label="Cart">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link to={localStorage.getItem('user') ? "/profile" : "/register"} className="p-1 text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200">
                            <button aria-label="Account">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay & Drawer */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

                {/* Drawer */}
                <div className={`absolute top-0 left-0 bottom-0 w-[75%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                T
                            </div>
                            <span className="text-xl font-bold text-gray-800">TechStore</span>
                        </div>

                        <ul className="flex flex-col gap-4">
                            {['Home', 'Shop', 'Smartphones', 'Laptops', 'Audio'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">Account</p>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/profile" className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                                        <span>My Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/orders" className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                                        <span>Orders</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;