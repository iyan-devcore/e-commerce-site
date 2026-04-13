import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LIMIT = 12;

const Shop = () => {
    const navigate = useNavigate();

    // Products & pagination
    const [products, setProducts]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal]           = useState(0);

    // Filters & sort (server-side)
    const [searchTerm, setSearchTerm]             = useState('');
    const [debouncedSearch, setDebouncedSearch]   = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [inStockOnly, setInStockOnly]           = useState(false);
    const [sortBy, setSortBy]                     = useState('');

    // Price filter (client-side on current page)
    const [maxPriceLimit, setMaxPriceLimit]   = useState(50000);
    const [maxPrice, setMaxPrice]             = useState(50000);
    const [priceInitialized, setPriceInitialized] = useState(false);

    // Categories (populated from first full load)
    const [allCategories, setAllCategories] = useState([]);

    // Wishlist
    const [wishlist, setWishlist] = useState([]);

    // Debounce search input by 400ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // reset to first page on new search
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch categories once for sidebar (no pagination)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token || '';
                const res  = await fetch(
                    `${process.env.REACT_APP_API_URL}/product/getProducts?limit=100`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.data) {
                    const counts = {};
                    data.data.forEach(p => {
                        if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
                    });
                    setAllCategories(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));

                    if (!priceInitialized) {
                        const highest = Math.max(...data.data.map(p => p.price || 0));
                        if (highest > 0) { setMaxPriceLimit(highest); setMaxPrice(highest); }
                        setPriceInitialized(true);
                    }
                }
            } catch (e) { console.error('Category fetch error', e); }
        };
        fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch wishlist once
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('user'))?.token || '';
        if (!token) return;
        fetch(`${process.env.REACT_APP_API_URL}/wishlist/`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (data.success) setWishlist(data.wishlist.products.map(p => p._id || p));
            })
            .catch(() => {});
    }, []);

    // Fetch paginated products whenever filters/page change
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || '';
            const params = new URLSearchParams({
                page:  page,
                limit: LIMIT,
                sort:  sortBy,
                ...(debouncedSearch                && { search: debouncedSearch }),
                ...(selectedCategories.length === 1 && { category: selectedCategories[0] }),
                ...(inStockOnly                     && { inStock: 'true' }),
            });

            const res  = await fetch(
                `${process.env.REACT_APP_API_URL}/product/getProducts?${params}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.data) {
                setProducts(data.data);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            }
        } catch (e) {
            console.error('Error fetching products:', e);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, selectedCategories, inStockOnly, sortBy]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleWishlistToggle = async (e, productId) => {
        e.stopPropagation();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const token = JSON.parse(storedUser).token;
        try {
            const res  = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (data.success) {
                setWishlist(prev =>
                    data.action === 'added' ? [...prev, productId] : prev.filter(id => id !== productId)
                );
            }
        } catch (e) { console.error('Wishlist toggle error', e); }
    };

    const handleCategoryToggle = (catName) => {
        setSelectedCategories(prev =>
            prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
        );
        setPage(1);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setSelectedCategories([]);
        setMaxPrice(maxPriceLimit);
        setInStockOnly(false);
        setSortBy('');
        setPage(1);
    };

    // Client-side price filter only (applied to current page results)
    const filteredProducts = products.filter(p => {
        if ((p.price || 0) > maxPrice) return false;
        if (selectedCategories.length > 1 && !selectedCategories.includes(p.category)) return false;
        return true;
    });

    const hasActiveFilters = searchTerm || selectedCategories.length || inStockOnly || sortBy;

    // Pagination helpers
    const getPageNumbers = () => {
        const pages = [];
        const delta = 2;
        for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Shop Our Products</h1>
                    <p className="text-gray-500 mt-2">
                        {total > 0 ? `${total} product${total !== 1 ? 's' : ''} available` : 'Find your perfect product'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR FILTERS */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Categories</h3>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                                </div>
                                <div className="space-y-3">
                                    {allCategories.map(cat => (
                                        <label key={cat.name} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat.name)}
                                                    onChange={() => handleCategoryToggle(cat.name)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                />
                                                <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors text-sm">{cat.name}</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">({cat.count})</span>
                                        </label>
                                    ))}
                                    {allCategories.length === 0 && !loading && (
                                        <span className="text-sm text-gray-400">No categories found</span>
                                    )}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6 py-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Price Range</h3>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                                </div>
                                <div className="px-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPriceLimit}
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
                                        <span>₹0</span>
                                        <span>₹{maxPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Availability</h3>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                                </div>
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={e => { setInStockOnly(e.target.checked); setPage(1); }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors text-sm">In Stock Only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 border-t md:border-t-0 pt-6 md:pt-0 border-gray-100">

                        {/* Search & Sort Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white sm:text-sm transition"
                                />
                            </div>
                            <div className="w-full sm:w-auto flex items-center gap-3">
                                <span className="text-sm text-gray-500 whitespace-nowrap hidden md:block">Sort by:</span>
                                <div className="relative w-full sm:w-auto">
                                    <select
                                        value={sortBy}
                                        onChange={e => handleSortChange(e.target.value)}
                                        className="appearance-none block w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer font-medium text-sm transition"
                                    >
                                        <option value="">Featured</option>
                                        <option value="newest">Newest</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600 font-medium">
                                {loading ? 'Loading…' : `Showing ${filteredProducts.length} of ${total} results`}
                            </p>
                            {totalPages > 1 && (
                                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                            )}
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(LIMIT)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                                        <div className="h-56 bg-gray-200" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                            <div className="h-5 bg-gray-200 rounded w-1/4 mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-xl font-medium text-gray-800 mb-2">No products found</h2>
                                <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search, price range, or categories.</p>
                                <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors">
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group flex flex-col h-full"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="h-56 overflow-hidden bg-gray-50 relative flex justify-center items-center p-4">
                                            <img
                                                src={(product.imageUpload && product.imageUpload.length > 0) ? product.imageUpload[0] : 'https://via.placeholder.com/300?text=No+Image'}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500"
                                                loading="lazy"
                                            />
                                            {product.stock <= 0 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</div>
                                            )}
                                            <button
                                                className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all focus:outline-none ${wishlist.includes(product._id) ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                                                onClick={e => handleWishlistToggle(e, product._id)}
                                            >
                                                <svg className="w-5 h-5" fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
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
                                                        onClick={e => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
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

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="First page"
                                >
                                    «
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    ‹ Prev
                                </button>

                                {getPageNumbers().map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setPage(n)}
                                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                                            n === page
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next ›
                                </button>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Last page"
                                >
                                    »
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
