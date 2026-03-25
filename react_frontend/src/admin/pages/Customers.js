import React, { useState, useEffect } from 'react';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/getUsers');
            const data = await res.json();
            if (data.data) {
                const formatted = data.data.map(user => ({
                    ...user,
                    name: `${user.firstName} ${user.lastName}`,
                    orders: Math.floor(Math.random() * 5), // Mock order count for aesthetic
                    spent: Math.random() * 500 // Mock spent since user schema doesn't track this
                }));
                setCustomers(formatted);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const columns = [
        { header: 'ID', accessor: 'id', render: (row) => <span className="font-mono font-medium text-blue-600">#{row.id}</span> },
        {
            header: 'Customer Info',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img
                        className="h-8 w-8 rounded-full bg-slate-200"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`}
                        alt={row.name}
                    />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Total Orders',
            accessor: 'orders',
            render: (row) => <span className="text-sm text-gray-700">{row.orders} orders</span>
        },
        {
            header: 'Total Spent',
            accessor: 'spent',
            render: (row) => <span className="font-bold text-gray-900">₹{row.spent.toFixed(2)}</span>
        },
    ];

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-900 text-xs font-medium">Edit</button>
            <button className="text-red-600 hover:text-red-900 text-xs font-medium">Delete</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Customers Management</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Add Customer
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md w-full"
                />
            </div>

            <Table
                columns={columns}
                data={filteredCustomers}
                actions={actions}
            />
        </div>
    );
};

export default Customers;
