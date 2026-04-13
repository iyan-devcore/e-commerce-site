import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'Credit Card'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData(prev => ({ ...prev, fullName: `${parsedUser.firstName} ${parsedUser.lastName}` }));
        
        const cartKey = `cart_${parsedUser.id}`;
        const items = JSON.parse(localStorage.getItem(cartKey)) || [];
        if (items.length === 0) {
            navigate('/shop');
            return;
        }
        setCartItems(items);
    }, [navigate]);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.discountPrice || item.product.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const subtotal = calculateSubtotal();
        const total = subtotal + 50; // Add shipping
        
        const orderData = {
            customerName: formData.fullName,
            email: user.email,
            phone: formData.phone,
            total,
            paymentMethod: formData.paymentMethod,
            address: `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.zipCode}`,
            items: cartItems.map(item => ({
                productId: item.product._id,
                name: item.product.name || item.product.title,
                price: item.product.discountPrice || item.product.price,
                quantity: item.quantity,
                color: item.color ? item.color.name : null,
                size: item.size ? item.size.name : null
            }))
        };


        try {
            const token = user.token || "";
            const response = await fetch(`${process.env.REACT_APP_API_URL}/order/createOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // Clear cart
                localStorage.removeItem(`cart_${user.id}`);
                window.dispatchEvent(new Event('cartUpdated'));
                alert("Order placed successfully!");
                navigate('/');
            } else {
                const errData = await response.json();
                alert(`Error: ${errData.message}`);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user || cartItems.length === 0) return null;

    const subtotal = calculateSubtotal();
    const finalTotal = subtotal + 50;

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left - Form */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Shipping Information</h2>
                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="123 Main St, Apartment/Studio" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                        <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-6 border-b pb-4">Payment Method</h2>
                                <div className="space-y-4">
                                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" name="paymentMethod" value="Credit Card" checked={formData.paymentMethod === 'Credit Card'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                        <span className="ml-3 font-medium text-gray-900">Credit / Debit Card</span>
                                    </label>
                                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                        <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                                    </label>
                                </div>
                                <button type="submit" disabled={loading} className="w-full mt-8 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
                                    {loading ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)} & Place Order`}
                                </button>
                            </form>
                        </div>
                    </div>
                    {/* Right - Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
                            <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
                                {cartItems.map((item, index) => {
                                    const price = item.product.discountPrice || item.product.price || 0;
                                    return (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={item.product.images ? item.product.images[0] : (item.product.imageUpload ? item.product.imageUpload[0] : 'https://via.placeholder.com/150')} 
                                                    alt={item.product.title || item.product.name} 
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.title || item.product.name}</h4>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm">₹{price * item.quantity}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-4 border-t pt-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">₹50.00</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
