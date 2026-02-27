import React from 'react';

const Dashboard = () => {
    const stats = [
        { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up' },
        { name: 'Active Users', value: '2,338', change: '-1.5%', trend: 'down' },
        { name: 'New Orders', value: '1,245', change: '+12.5%', trend: 'up' },
        { name: 'Pending Issues', value: '12', change: '0%', trend: 'neutral' },
    ];

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
