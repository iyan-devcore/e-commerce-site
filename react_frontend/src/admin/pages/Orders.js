import React, { useState, useEffect } from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateStatus, setUpdateStatus] = useState({ orderStatus: '', paymentStatus: '' });

    const fetchOrders = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || "";
            const response = await fetch(`${process.env.REACT_APP_API_URL}/order/getOrders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.data) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setUpdateStatus({ orderStatus: order.orderStatus, paymentStatus: order.paymentStatus });
        setIsModalOpen(true);
    };

    const handleUpdateOrder = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || "";
            await fetch(`${process.env.REACT_APP_API_URL}/order/updateOrder/${selectedOrder._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updateStatus)
            });
            setIsModalOpen(false);
            fetchOrders();
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    const handleDeleteOrder = async (id) => {
        if(window.confirm("Are you sure you want to delete this order?")) {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token || "";
                await fetch(`${process.env.REACT_APP_API_URL}/order/deleteOrder/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setIsModalOpen(false);
                fetchOrders();
            } catch (err) {
                console.error('Error deleting order:', err);
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus ? order.orderStatus === filterStatus : true;
        const matchesSearch = (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) || 
                              (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const columns = [
        { header: 'Order ID', accessor: '_id', render: (row) => <span className="font-mono font-medium text-blue-600">#{row._id.substring(row._id.length - 6).toUpperCase()}</span> },
        {
            header: 'Customer',
            accessor: 'customerName',
            render: (row) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{row.customerName}</div>
                    <div className="text-xs text-gray-500">{row.email}</div>
                </div>
            )
        },
        { header: 'Date', accessor: 'createdAt', render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
        {
            header: 'Total',
            accessor: 'total',
            render: (row) => <span className="font-bold">₹{row.total.toFixed(2)}</span>
        },
        {
            header: 'Payment',
            accessor: 'paymentStatus',
            render: (row) => <Badge variant={row.paymentStatus}>{row.paymentStatus}</Badge>
        },
        {
            header: 'Status',
            accessor: 'orderStatus',
            render: (row) => <Badge variant={row.orderStatus}>{row.orderStatus}</Badge>
        },
    ];

    const actions = (row) => (
        <button onClick={() => handleViewDetails(row)} className="text-blue-600 hover:text-blue-900 text-xs font-medium">View Details</button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
                <Input
                    placeholder="Search Order ID or Customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
                <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                        { value: '', label: 'All Statuses' },
                        { value: 'Processing', label: 'Processing' },
                        { value: 'Shipped', label: 'Shipped' },
                        { value: 'Delivered', label: 'Delivered' },
                        { value: 'Cancelled', label: 'Cancelled' },
                    ]}
                    className="max-w-xs"
                />
            </div>

            <Table
                columns={columns}
                data={filteredOrders}
                actions={actions}
            />

            {/* Order Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Order Details"
                footer={
                    <>
                        <Button onClick={handleUpdateOrder}>Update Order Status</Button>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteOrder(selectedOrder._id)}>Delete Order</Button>
                    </>
                }
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">Order ID</span>
                                <span className="font-mono font-medium text-gray-900">#{selectedOrder._id}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Date Placed</span>
                                <span className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Customer</span>
                                <span className="font-medium text-gray-900">{selectedOrder.customerName}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Email</span>
                                <span className="font-medium text-gray-900">{selectedOrder.email}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500 block">Shipping Address</span>
                                <span className="font-medium text-gray-900">{selectedOrder.address}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Payment Method</span>
                                <span className="font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Total Amount</span>
                                <span className="font-bold text-gray-900">₹{selectedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-2 border rounded">
                                        <div>
                                            <div className="font-medium text-sm text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Qty: {item.quantity} | {item.color && `Color: ${item.color}`} {item.size && `Size: ${item.size}`}
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm text-gray-900">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                            <Select
                                label="Update Order Status"
                                value={updateStatus.orderStatus}
                                onChange={(e) => setUpdateStatus({...updateStatus, orderStatus: e.target.value})}
                                options={[
                                    { value: 'Processing', label: 'Processing' },
                                    { value: 'Shipped', label: 'Shipped' },
                                    { value: 'Delivered', label: 'Delivered' },
                                    { value: 'Cancelled', label: 'Cancelled' },
                                ]}
                            />
                            <Select
                                label="Update Payment Status"
                                value={updateStatus.paymentStatus}
                                onChange={(e) => setUpdateStatus({...updateStatus, paymentStatus: e.target.value})}
                                options={[
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Paid', label: 'Paid' },
                                    { value: 'Refunded', label: 'Refunded' },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;
