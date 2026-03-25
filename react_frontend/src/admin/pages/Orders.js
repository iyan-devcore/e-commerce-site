import React, { useState, useEffect } from 'react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/order/getOrders');
                const data = await response.json();
                if (data.data) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

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
        <button className="text-blue-600 hover:text-blue-900 text-xs font-medium">View Details</button>
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
        </div>
    );
};

export default Orders;
