export const mockProducts = [
    {
        id: 1,
        name: "Premium Headphones",
        category: "Electronics",
        price: 349.99,
        discountPrice: 299.99,
        stock: 15,
        status: "Active",
        sku: "PH-001",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        description: "High quality noise cancelling headphones."
    },
    {
        id: 2,
        name: "Ergonomic Office Chair",
        category: "Furniture",
        price: 249.99,
        discountPrice: 199.99,
        stock: 8,
        status: "Active",
        sku: "OC-002",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
        description: "Comfortable chair for long work hours."
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Footwear",
        price: 120.00,
        discountPrice: 99.00,
        stock: 0,
        status: "Inactive",
        sku: "RS-003",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        description: "Lightweight running shoes."
    },
    {
        id: 4,
        name: "Smartphone 13 Pro",
        category: "Electronics",
        price: 999.00,
        discountPrice: 999.00,
        stock: 50,
        status: "Active",
        sku: "SM-004",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop",
        description: "Latest smartphone."
    },
    {
        id: 5,
        name: "Mechanical Keyboard",
        category: "Electronics",
        price: 150.00,
        discountPrice: 135.00,
        stock: 25,
        status: "Active",
        sku: "MK-005",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91a05c?q=80&w=1000&auto=format&fit=crop",
        description: "RGB mechanical keyboard."
    }
];

export const mockOrders = [
    {
        id: "#ORD-7829",
        customer: "John Doe",
        email: "john@example.com",
        date: "2023-10-25",
        total: 349.99,
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        paymentMethod: "Credit Card",
        items: [
            { name: "Premium Headphones", quantity: 1, price: 349.99 }
        ],
        address: "123 Main St, New York, NY"
    },
    {
        id: "#ORD-7830",
        customer: "Jane Smith",
        email: "jane@example.com",
        date: "2023-10-26",
        total: 120.00,
        paymentStatus: "Pending",
        orderStatus: "Processing",
        paymentMethod: "PayPal",
        items: [
            { name: "Running Shoes", quantity: 1, price: 120.00 }
        ],
        address: "456 Elm St, San Francisco, CA"
    },
    {
        id: "#ORD-7831",
        customer: "Alice Johnson",
        email: "alice@example.com",
        date: "2023-10-27",
        total: 999.00,
        paymentStatus: "Paid",
        orderStatus: "Shipped",
        paymentMethod: "Credit Card",
        items: [
            { name: "Smartphone 13 Pro", quantity: 1, price: 999.00 }
        ],
        address: "789 Oak St, Chicago, IL"
    },
    {
        id: "#ORD-7832",
        customer: "Bob Williams",
        email: "bob@example.com",
        date: "2023-10-28",
        total: 249.99,
        paymentStatus: "Refunded",
        orderStatus: "Cancelled",
        paymentMethod: "Debit Card",
        items: [
            { name: "Ergonomic Office Chair", quantity: 1, price: 249.99 }
        ],
        address: "321 Pine St, Seattle, WA"
    }
];

export const mockCustomers = [
    { id: 1, name: "John Doe", email: "john@example.com", orders: 5, spent: 1200 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", orders: 2, spent: 300 },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", orders: 8, spent: 2500 },
];
