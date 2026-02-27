
import React from 'react';
import Sidebar from './sidebar';

const Dashboard = () => {
    const stats = [
        { title: 'Total Revenue', value: '₹45,231', change: '+20.1%', isPositive: true, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-100 text-green-600' },
        { title: 'Total Orders', value: '356', change: '+5.4%', isPositive: true, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-blue-100 text-blue-600' },
        { title: 'New Customers', value: '2,345', change: '-1.2%', isPositive: false, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-purple-100 text-purple-600' },
        { title: 'Pending Issues', value: '12', change: '-3', isPositive: true, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'bg-orange-100 text-orange-600' },
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'Alex Johnson', product: 'Wireless Headphones', amount: '₹2,499', status: 'Completed' },
        { id: '#ORD-002', customer: 'Maria Garcia', product: 'Smart Watch Series 7', amount: '₹24,999', status: 'Processing' },
        { id: '#ORD-003', customer: 'James Smith', product: 'Running Shoes', amount: '₹3,999', status: 'Pending' },
        { id: '#ORD-004', customer: 'Emily Davis', product: 'Leather Bag', amount: '₹5,499', status: 'Completed' },
        { id: '#ORD-005', customer: 'Michael Brown', product: 'Wireless Headphones', amount: '₹2,499', status: 'Cancelled' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="flex items-center justify-between px-8 py-5">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome back, John!</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                <img src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" alt="User" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                        </svg>
                                    </div>
                                    <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                                        {stat.change}
                                        <svg className={`w-3 h-3 ml-1 ${stat.isPositive ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                                <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentOrders.map((order, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                                                <td className="px-6 py-4 text-gray-600">{order.product}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Products / Placeholder for Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-gray-800 mb-6">Traffic Source</h2>
                            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
                                {/* Simple CSS-only placeholder for a chart */}
                                <div className="w-40 h-40 rounded-full border-[16px] border-blue-50 relative">
                                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-blue-500 border-r-blue-500 rotate-45"></div>
                                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-l-purple-500 rotate-12"></div>
                                </div>
                                <div className="mt-8 w-full space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                            <span className="text-gray-600">Direct</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">45%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                            <span className="text-gray-600">Social</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">35%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                                            <span className="text-gray-600">Others</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">20%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
