import React from 'react';

const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        primary: "bg-blue-100 text-blue-800",
        info: "bg-indigo-100 text-indigo-800",
    };

    // Status mapping helper
    const getStatusVariant = (status) => {
        const s = status?.toLowerCase();
        if (s === 'active' || s === 'delivered' || s === 'paid' || s === 'in stock') return 'success';
        if (s === 'pending' || s === 'processing') return 'warning';
        if (s === 'cancelled' || s === 'inactive' || s === 'out of stock') return 'danger';
        if (s === 'shipped') return 'primary';
        return 'default';
    };

    const finalVariant = variants[variant] ? variant : 'default'; // Or use getStatusVariant logic if passing status directly

    // Quick status badge logic if variant matches a status key, creating a smart badge
    const statusStyle = variants[getStatusVariant(children)] || variants[variant] || variants.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
