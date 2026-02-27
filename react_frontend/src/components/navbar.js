import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-[260px] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-sm border border-transparent focus-within:border-blue-500 transition-all duration-200">
                        <svg className="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-1 text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200" aria-label="Wishlist">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>

                        <button className="relative p-1 text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200" aria-label="Cart">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                                2
                            </span>
                        </button>

                        <Link to="/register" className="p-1 text-gray-600 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200">
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