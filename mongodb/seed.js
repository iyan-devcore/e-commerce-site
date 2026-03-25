import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './modules/Users.js';
import Product from './modules/Product.js';
import Order from './modules/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/iyan");
        console.log("Connected to MongoDB for seeding...");

        // 1. Remove all previous data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log("Cleared existing data.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // 2. Add at least 20 users
        const users = [];
        for (let i = 1; i <= 20; i++) {
            users.push({
                firstName: `FirstName${i}`,
                lastName: `LastName${i}`,
                email: `user${i}_${Date.now()}@example.com`,
                password: hashedPassword,
                imageUpload: `sample_user_${i}.jpg`,
                agreeTerms: true
            });
        }
        const insertedUsers = await User.insertMany(users);
        console.log(`${insertedUsers.length} users inserted.`);

        // 3. Add 10 products for each of the 3 categories
        const categories = ["Electronics", "Fashion", "Home & Kitchen"];
        const products = [];
        let productCounter = 1;

        for (const category of categories) {
            for (let i = 1; i <= 10; i++) {
                products.push({
                    name: `${category} Product ${i}`,
                    category: category,
                    price: Math.floor(Math.random() * 100) + 20,
                    discountPrice: Math.floor(Math.random() * 10),
                    stock: Math.floor(Math.random() * 100) + 10,
                    status: "Active",
                    sku: `SKU-${category.substring(0,3).toUpperCase()}-${Date.now()}-${productCounter}`,
                    description: `This is a great ${category.toLowerCase()} product.`,
                    imageUpload: `sample_${category.toLowerCase().replace(" & ", "_")}_${i}.jpg`
                });
                productCounter++;
            }
        }
        const insertedProducts = await Product.insertMany(products);
        console.log(`${insertedProducts.length} products inserted.`);

        // 4. Add at least 20 orders
        const orders = [];
        const paymentStatuses = ["Pending", "Paid", "Refunded"];
        const orderStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
        const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer"];

        for (let i = 1; i <= 20; i++) {
            // Randomly pick a product for the order
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            orders.push({
                customerName: `Customer ${i}`,
                email: `customer${i}@example.com`,
                total: randomProduct.price * quantity,
                paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
                orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                items: [
                    {
                        name: randomProduct.name,
                        quantity: quantity,
                        price: randomProduct.price
                    }
                ],
                address: `${i * 10} Main St, City, Country`
            });
        }
        const insertedOrders = await Order.insertMany(orders);
        console.log(`${insertedOrders.length} orders inserted.`);

        console.log("Database seeded successfully!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
