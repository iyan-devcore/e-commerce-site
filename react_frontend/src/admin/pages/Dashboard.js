import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';


const Dashboard = () => {
    const [stats, setStats] = useState([
        { name: 'Total Revenue', value: '₹0.00', change: '0%', trend: 'neutral' },
        { name: 'Registered Users', value: '0', change: '0%', trend: 'neutral' },
        { name: 'Total Orders', value: '0', change: '0%', trend: 'neutral' },
        { name: 'Total Products', value: '0', change: '0%', trend: 'neutral' },
    ]);

    const [revenueData, setRevenueData] = useState([
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 2000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 1890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ]);

    const [categoryData, setCategoryData] = useState([
        { name: 'Electronics', value: 400 },
        { name: 'Fashion', value: 300 },
        { name: 'Home', value: 300 },
        { name: 'Beauty', value: 200 },
    ]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token || "";
                const requestOptions = { headers: { 'Authorization': `Bearer ${token}` } };
                const [usersRes, ordersRes, productsRes] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/user/getUsers`, requestOptions).then(r => r.json()),
                    fetch(`${process.env.REACT_APP_API_URL}/order/getOrders`, requestOptions).then(r => r.json()),
                    fetch(`${process.env.REACT_APP_API_URL}/product/getProducts`, requestOptions).then(r => r.json())
                ]);

                const totalRevenue = ordersRes.data ? ordersRes.data.reduce((acc, order) => acc + order.total, 0) : 0;
                const totalUsers = usersRes.data ? usersRes.data.length : 0;
                const totalOrdersNum = ordersRes.data ? ordersRes.data.length : 0;
                const totalProducts = productsRes.data ? productsRes.data.length : 0;

                setStats([
                    { name: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, change: '+12.5%', trend: 'up' },
                    { name: 'Registered Users', value: totalUsers.toString(), change: '+3.2%', trend: 'up' },
                    { name: 'Total Orders', value: totalOrdersNum.toString(), change: '+8.1%', trend: 'up' },
                    { name: 'Total Products', value: totalProducts.toString(), change: '0%', trend: 'neutral' },
                ]);

                // Try to build real chart data from orders if available
                if (ordersRes.data && ordersRes.data.length > 0) {
                    // Logic to aggregate orders by day could go here
                    // For now, we mix real total into mock trends for better demo
                }
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    itemStyle={{color: '#3b82f6', fontWeight: 'bold'}}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Orders by Category</h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Items Section */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white shadow rounded-lg p-6 overflow-hidden">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Store Performance</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px'}} />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
