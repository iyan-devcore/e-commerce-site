import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CartIcon = () => (
    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const cartKey = `cart_${parsedUser.id}`;
        const items = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCartItems(items);
    }, [navigate]);

    const updateQuantity = (index, delta) => {
        const newCart = [...cartItems];
        newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
        setCartItems(newCart);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removeItem = (index) => {
        const newCart = cartItems.filter((_, i) => i !== index);
        setCartItems(newCart);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.discountPrice || item.product.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    if (!user) return null;

    const subtotal = calculateSubtotal();
    const exactTotal = subtotal > 0 ? subtotal + 50 : 0; // Assuming ₹50 fixed shipping

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                        <CartIcon />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our products to find something you love!</p>
                        <Link to="/shop" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                    {cartItems.map((item, index) => {
                                        const productPrice = item.product.discountPrice || item.product.price || 0;
                                        return (
                                            <li key={index} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative group p-2 cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                                                    <img 
                                                        src={item.product.images ? item.product.images[0] : (item.product.imageUpload ? item.product.imageUpload[0] : 'https://via.placeholder.com/150')} 
                                                        alt={item.product.title || item.product.name} 
                                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
                                                    />
                                                </div>
                                                
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                                                                {item.product.title || item.product.name}
                                                            </h3>
                                                            {item.color && <p className="text-sm text-gray-500 mt-1">Color: {item.color.name}</p>}
                                                            {item.size && <p className="text-sm text-gray-500">Size: {item.size.name}</p>}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-lg font-bold text-gray-900">₹{productPrice}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                                            <button 
                                                                onClick={() => updateQuantity(index, -1)}
                                                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                                                                disabled={item.quantity <= 1}
                                                                title="Decrease quantity"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-10 text-center text-sm font-medium text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <button 
                                                                onClick={() => updateQuantity(index, 1)}
                                                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                                                                title="Increase quantity"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => removeItem(index)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                                                        >
                                                            <TrashIcon /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium text-gray-900">₹50.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium text-gray-900">₹0.00</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-lg font-bold text-blue-600">₹{exactTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/checkout')} className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mb-4">
                                    Proceed to Checkout
                                </button>
                                <Link to="/shop" className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
