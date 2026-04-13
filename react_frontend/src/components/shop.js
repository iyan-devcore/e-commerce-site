import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // New Filter States
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [maxPriceLimit, setMaxPriceLimit] = useState(50000);
    const [maxPrice, setMaxPrice] = useState(50000);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('Featured');
    
    // Wishlist state
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || "";
            const res = await fetch(`${process.env.REACT_APP_API_URL}/product/getProducts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.data) {
                setProducts(data.data);
                
                // Set max price limit dynamically based on fetched products
                const highestPrice = Math.max(...data.data.map(p => p.price || 0));
                if (highestPrice > 0) {
                    setMaxPriceLimit(highestPrice);
                    setMaxPrice(highestPrice);
                }
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

            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

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

    // Calculate dynamic categories and their counts
    const categoryCounts = products.reduce((acc, product) => {
        if (product.category) {
            acc[product.category] = (acc[product.category] || 0) + 1;
        }
        return acc;
    }, {});
    
    const categoriesList = Object.keys(categoryCounts).map(key => ({
        name: key,
        count: categoryCounts[key]
    })).sort((a, b) => b.count - a.count); // Sort by most items first

    const handleCategoryToggle = (catName) => {
        if (selectedCategories.includes(catName)) {
            setSelectedCategories(selectedCategories.filter(c => c !== catName));
        } else {
            setSelectedCategories([...selectedCategories, catName]);
        }
    };

    // Filter and Sort logic
    let result = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesPrice = (product.price || 0) <= maxPrice;
        
        // Assuming products have a stock field representing availability
        const matchesStock = inStockOnly ? (product.stock > 0) : true;

        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    if (sortBy === 'Price: Low to High') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'Price: High to Low') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'Newest') {
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'Highest Rated') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const filteredProducts = result;

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12">
            <div className="container mx-auto px-4">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Shop Our Products</h1>
                    <p className="text-gray-500 mt-2">Find exactly what you're looking for from our premium collection</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* SIDEBAR FILTERS */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>
                            
                            {/* Categories Filter */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Categories</h3>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                </div>
                                <div className="space-y-3">
                                    {categoriesList.map(cat => (
                                        <label key={cat.name} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedCategories.includes(cat.name)}
                                                    onChange={() => handleCategoryToggle(cat.name)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
                                                />
                                                <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">{cat.name}</span>
                                            </div>
                                            <span className="text-gray-400 text-sm">({cat.count})</span>
                                        </label>
                                    ))}
                                    {categoriesList.length === 0 && !loading && (
                                        <span className="text-sm text-gray-400">No categories found</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Price Range Slider */}
                            <div className="mb-6 py-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Price Range</h3>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                </div>
                                <div className="px-1">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max={maxPriceLimit} 
                                        value={maxPrice} 
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
                                        <span>₹0</span>
                                        <span>₹{maxPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Availability Checkbox */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Availability</h3>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                </div>
                                <label className="flex items-center cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
                                    />
                                    <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 border-t md:border-t-0 pt-6 md:pt-0 border-gray-100">
                        {/* Search and Sort Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            
                            {/* Search Input */}
                            <div className="w-full sm:w-1/2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white sm:text-sm transition duration-200"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="w-full sm:w-auto flex items-center gap-3">
                                <span className="text-sm text-gray-500 whitespace-nowrap hidden md:block">Sort by:</span>
                                <div className="relative w-full sm:w-auto">
                                    <select 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none block w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white cursor-pointer font-medium text-sm transition duration-200"
                                    >
                                        <option value="Featured">Featured</option>
                                        <option value="Newest">Newest</option>
                                        <option value="Price: Low to High">Price: Low to High</option>
                                        <option value="Price: High to Low">Price: High to Low</option>
                                        <option value="Highest Rated">Highest Rated</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Results Count */}
                        <div className="mb-6">
                            <p className="text-gray-600 font-medium">Showing {filteredProducts.length} results</p>
                        </div>
                        
                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-xl font-medium text-gray-800 mb-2">No products found</h2>
                                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find anything matching your filters. Try adjusting your search, price range, or categories.</p>
                                <button 
                                    onClick={() => { 
                                        setSearchTerm(''); 
                                        setSelectedCategories([]); 
                                        setMaxPrice(maxPriceLimit); 
                                        setInStockOnly(false); 
                                    }}
                                    className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group flex flex-col h-full"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="h-56 overflow-hidden bg-gray-50 relative flex justify-center items-center p-4">
                                            <img 
                                                src={(product.imageUpload && product.imageUpload.length > 0) ? product.imageUpload[0] : "https://via.placeholder.com/300?text=No+Image"} 
                                                alt={product.name} 
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" 
                                                loading="lazy" 
                                            />
                                            {product.stock <= 0 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Out of Stock
                                                </div>
                                            )}
                                            {/* Wishlist Heart Button */}
                                            <button 
                                                className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all focus:outline-none ${wishlist.includes(product._id) ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                                                onClick={(e) => handleWishlistToggle(e, product._id)}
                                            >
                                                <svg className="w-5 h-5" fill={wishlist.includes(product._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <p className="text-gray-400 text-xs tracking-wider uppercase mb-1 font-semibold">{product.category}</p>
                                            <h3 className="font-bold text-gray-800 text-md mb-3 line-clamp-2 hover:text-blue-600 transition-colors">{product.name}</h3>
                                            
                                            <div className="mt-auto">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                                                    <button 
                                                        className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow group-hover:bg-blue-600 group-hover:text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/product/${product._id}`);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
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
            </div>
        </div>
    );
};

export default Shop;
