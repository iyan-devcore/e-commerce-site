import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { name: 'Total Revenue', value: '₹0.00', change: '0%', trend: 'neutral' },
        { name: 'Registered Users', value: '0', change: '0%', trend: 'neutral' },
        { name: 'Total Orders', value: '0', change: '0%', trend: 'neutral' },
        { name: 'Total Products', value: '0', change: '0%', trend: 'neutral' },
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token || "";
                const requestOptions = { headers: { 'Authorization': `Bearer ${token}` } };
                const [usersRes, ordersRes, productsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/user/getUsers', requestOptions).then(r => r.json()),
                    fetch('http://localhost:5000/api/order/getOrders', requestOptions).then(r => r.json()),
                    fetch('http://localhost:5000/api/product/getProducts', requestOptions).then(r => r.json())
                ]);

                const totalRevenue = ordersRes.data ? ordersRes.data.reduce((acc, order) => acc + order.total, 0) : 0;
                const totalUsers = usersRes.data ? usersRes.data.length : 0;
                const totalOrdersNum = ordersRes.data ? ordersRes.data.length : 0;
                const totalProducts = productsRes.data ? productsRes.data.length : 0;

                setStats([
                    { name: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, change: '-', trend: 'up' },
                    { name: 'Registered Users', value: totalUsers.toString(), change: '-', trend: 'up' },
                    { name: 'Total Orders', value: totalOrdersNum.toString(), change: '-', trend: 'up' },
                    { name: 'Total Products', value: totalProducts.toString(), change: '-', trend: 'neutral' },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
                        <div className={`mt-2 flex items-center text-sm ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {item.trend === 'up' && <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>}
                            {item.trend === 'down' && <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                            <span className="ml-2 font-medium">{item.change}</span>
                            <span className="ml-1 text-gray-400">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    Chart Placeholder
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
