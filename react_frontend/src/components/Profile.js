import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const statusConfig = {
    Processing: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: '🕐', step: 1, label: 'Processing' },
    Shipped:    { color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   icon: '🚚', step: 2, label: 'Shipped' },
    Delivered:  { color: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500',  icon: '✅', step: 3, label: 'Delivered' },
    Cancelled:  { color: 'bg-red-100 text-red-700 border-red-200',          dot: 'bg-red-400',    icon: '❌', step: 0, label: 'Cancelled' },
};

const paymentConfig = {
    Pending:  'bg-orange-100 text-orange-700',
    Paid:     'bg-green-100 text-green-700',
    Refunded: 'bg-purple-100 text-purple-700',
};

const OrderStepper = ({ status }) => {
    const steps = [
        { label: 'Order Placed', icon: '🛒' },
        { label: 'Processing',   icon: '⚙️' },
        { label: 'Shipped',      icon: '🚚' },
        { label: 'Delivered',    icon: '🏠' },
    ];
    const stepMap = { Processing: 1, Shipped: 2, Delivered: 3 };
    const currentStep = status === 'Cancelled' ? -1 : (stepMap[status] ?? 1);
    const isCancelled = status === 'Cancelled';

    return (
        <div className="w-full py-4">
            {isCancelled ? (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                    <span>❌</span>
                    <span>This order has been cancelled.</span>
                </div>
            ) : (
                <div className="flex items-center">
                    {steps.map((step, idx) => {
                        const done = currentStep > idx;
                        const active = currentStep === idx;
                        return (
                            <React.Fragment key={step.label}>
                                <div className="flex flex-col items-center min-w-[56px]">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300
                                        ${done ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' :
                                          active ? 'bg-white border-blue-600 shadow-md' :
                                          'bg-gray-50 border-gray-200'}`}
                                    >
                                        {done ? '✓' : <span className="text-base">{step.icon}</span>}
                                    </div>
                                    <span className={`text-[10px] mt-1.5 font-semibold text-center leading-tight
                                        ${done || active ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 rounded-full mx-1 mb-4 transition-all duration-500
                                        ${currentStep > idx ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('account');
    const [cancellingId, setCancellingId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(null); // stores order object

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/register'); return; }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchOrders(parsedUser.token);
    }, [navigate]);

    const fetchOrders = async (token) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/order/myorders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.data) setOrders(data.data);
        } catch (e) {
            console.error("Error fetching orders", e);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        setCancellingId(orderId);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await fetch(`${process.env.REACT_APP_API_URL}/order/cancelOrder/${orderId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
                setShowCancelModal(null);
            } else {
                alert(data.message || 'Could not cancel order.');
            }
        } catch (e) {
            alert('Something went wrong. Please try again.');
        } finally {
            setCancellingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/login');
    };

    const downloadInvoice = (order) => {
        const doc = new jsPDF();
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 220, 34, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TechStore', 14, 15);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Your Premium Tech Destination', 14, 23);
        doc.text('INVOICE', 172, 14);
        doc.text(`#${order._id.slice(-8).toUpperCase()}`, 172, 22);
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Bill To:', 14, 46);
        doc.setFont('helvetica', 'normal');
        doc.text(order.customerName, 14, 53);
        doc.text(order.email, 14, 59);
        doc.text(order.address, 14, 65);

        doc.setFont('helvetica', 'bold');
        doc.text('Order Details:', 130, 46);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 130, 53);
        doc.text(`Payment: ${order.paymentMethod}`, 130, 59);
        doc.text(`Order Status: ${order.orderStatus}`, 130, 65);
        doc.text(`Payment Status: ${order.paymentStatus}`, 130, 71);

        autoTable(doc, {
            startY: 82,
            head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
            body: order.items.map((item, idx) => [
                idx + 1,
                item.name + (item.color ? ` (${item.color})` : '') + (item.size ? ` / ${item.size}` : ''),
                item.quantity,
                `Rs. ${Number(item.price).toFixed(2)}`,
                `Rs. ${(item.quantity * item.price).toFixed(2)}`
            ]),
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            styles: { fontSize: 9.5, cellPadding: 5 },
            columnStyles: { 0: { halign: 'center', cellWidth: 12 }, 2: { halign: 'center', cellWidth: 14 }, 3: { halign: 'right', cellWidth: 32 }, 4: { halign: 'right', cellWidth: 32 } },
        });

        const finalY = doc.lastAutoTable.finalY + 8;
        doc.setFillColor(245, 247, 255);
        doc.rect(128, finalY, 67, 15, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Grand Total:', 132, finalY + 10);
        doc.setTextColor(37, 99, 235);
        doc.text(`Rs. ${Number(order.total).toFixed(2)}`, 191, finalY + 10, { align: 'right' });
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Thank you for shopping with TechStore!', 105, 285, { align: 'center' });
        doc.save(`Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
    };

    if (!user) return null;

    const ordersDelivered = orders.filter(o => o.orderStatus === 'Delivered').length;
    const ordersActive = orders.filter(o => ['Processing', 'Shipped'].includes(o.orderStatus)).length;
    const totalSpent = orders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + Number(o.total), 0);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">

                {/* Cancel Confirmation Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
                            <div className="text-4xl text-center mb-4">⚠️</div>
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Cancel this order?</h3>
                            <p className="text-gray-500 text-sm text-center mb-2">
                                Order <span className="font-mono font-semibold text-gray-700">#{showCancelModal._id.slice(-8).toUpperCase()}</span>
                            </p>
                            <p className="text-gray-400 text-xs text-center mb-6">This action cannot be undone. You can only cancel orders that haven't shipped yet.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={() => handleCancelOrder(showCancelModal._id)}
                                    disabled={cancellingId === showCancelModal._id}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                                >
                                    {cancellingId === showCancelModal._id ? 'Cancelling…' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-28 relative" />
                    <div className="px-8 pb-6">
                        <div className="relative flex justify-between items-end -mt-12 mb-5">
                            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
                                {user.imageUpload ? (
                                    <img src={user.imageUpload} alt={user.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                                        {user.firstName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm">
                                Log out
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                        <p className="text-gray-500 mt-1 text-sm">{user.email}</p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Total Orders</p>
                            </div>
                            <div className="text-center border-x border-gray-100">
                                <p className="text-2xl font-bold text-blue-600">{ordersActive}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Active</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{ordersDelivered}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Delivered</p>
                            </div>
                        </div>
                        <div className="mt-3 bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">Total Spent</span>
                            <span className="text-lg font-bold text-blue-600">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-6">
                    {[
                        { key: 'account', label: 'Account Info', icon: '👤' },
                        { key: 'orders',  label: `Order History${orders.length > 0 ? ` (${orders.length})` : ''}`, icon: '📦' },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-0">
                            {[
                                { label: 'First Name', value: user.firstName },
                                { label: 'Last Name',  value: user.lastName },
                                { label: 'Email Address', value: user.email },
                            ].map((field, i, arr) => (
                                <div key={field.label} className={`flex justify-between py-3 ${i < arr.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <span className="text-gray-500">{field.label}</span>
                                    <span className="font-medium text-gray-900">{field.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        {loadingOrders ? (
                            <div className="flex justify-center items-center h-48 bg-white rounded-2xl border border-gray-100">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <div className="text-6xl mb-4">📦</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                                <p className="text-gray-500 mb-6">You haven't placed any orders. Start shopping!</p>
                                <button onClick={() => navigate('/shop')} className="bg-blue-600 text-white px-7 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => {
                                    const cfg = statusConfig[order.orderStatus] || statusConfig.Processing;
                                    const isExpanded = expandedOrder === order._id;
                                    const canCancel = order.orderStatus === 'Processing';
                                    return (
                                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200">
                                            {/* Order Header */}
                                            <div className="p-5">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono font-bold text-gray-800 text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                                                                {cfg.icon} {order.orderStatus}
                                                            </span>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${paymentConfig[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                                                                {order.paymentStatus}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                                                            <span>📅 {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                            <span>•</span>
                                                            <span>💳 {order.paymentMethod}</span>
                                                            <span>•</span>
                                                            <span>🛍️ {order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5">📍 {order.address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                                        <span className="text-lg font-bold text-gray-900">₹{Number(order.total).toLocaleString('en-IN')}</span>
                                                        <button
                                                            onClick={() => downloadInvoice(order)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            PDF
                                                        </button>
                                                        {canCancel && (
                                                            <button
                                                                onClick={() => setShowCancelModal(order)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Order Progress Stepper */}
                                                <OrderStepper status={order.orderStatus} />
                                            </div>

                                            {/* Expandable Items Panel */}
                                            {isExpanded && (
                                                <div className="border-t border-gray-100 bg-gray-50/50">
                                                    <div className="px-5 pt-4 pb-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Items Ordered</p>
                                                        <div className="space-y-2">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100 shadow-sm">
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                            <span>Qty: {item.quantity}</span>
                                                                            {item.color && <><span>·</span><span>Color: {item.color}</span></>}
                                                                            {item.size  && <><span>·</span><span>Size: {item.size}</span></>}
                                                                            <span>·</span>
                                                                            <span>₹{Number(item.price).toLocaleString()} each</span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-sm font-bold text-gray-900 ml-4">
                                                                        ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 pb-4">
                                                            <div className="text-xs text-gray-400">
                                                                Customer: <span className="font-medium text-gray-600">{order.customerName}</span> · {order.email}
                                                            </div>
                                                            <span className="text-base font-bold text-blue-600">Grand Total: ₹{Number(order.total).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
