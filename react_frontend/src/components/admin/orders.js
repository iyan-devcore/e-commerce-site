import React, { useState } from 'react';
import Sidebar from './sidebar';

const Orders = () => {
    const [statusFilter, setStatusFilter] = useState('All');

    // Mock data
    const orders = [
        { id: '#ORD-7829', customer: 'Alice Freeman', date: 'Oct 24, 2024', total: '₹5,499', status: 'Pending', items: 3 },
        { id: '#ORD-7828', customer: 'Robert Wolf', date: 'Oct 24, 2024', total: '₹2,499', status: 'Completed', items: 1 },
        { id: '#ORD-7827', customer: 'Sarah Connor', date: 'Oct 23, 2024', total: '₹12,999', status: 'Processing', items: 2 },
        { id: '#ORD-7826', customer: 'John Smith', date: 'Oct 23, 2024', total: '₹899', status: 'Cancelled', items: 1 },
        { id: '#ORD-7825', customer: 'Emily Blunt', date: 'Oct 22, 2024', total: '₹24,999', status: 'Shipped', items: 1 },
        { id: '#ORD-7824', customer: 'Michael Chen', date: 'Oct 21, 2024', total: '₹3,250', status: 'Completed', items: 4 },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm sticky top-0 z-40 px-8 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                        <p className="text-sm text-gray-500">Manage customer orders and shipments</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            Export
                        </button>
                    </div>
                </header>

                <main className="p-8">
                    {/* Status Tabs */}
                    <div className="mb-6 overflow-x-auto">
                        <div className="flex space-x-2 border-b border-gray-200 pb-1 w-max md:w-full">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setStatusFilter(tab)}
                                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 border-b-2 ${statusFilter === tab
                                            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">{order.id}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                                                        {order.customer.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{order.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{order.items}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{order.total}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 font-medium">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Orders;
