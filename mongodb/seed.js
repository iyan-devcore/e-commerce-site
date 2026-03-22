import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './modules/Users.js';
import Product from './modules/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/iyan");
        console.log("Connected to MongoDB for seeding...");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const users = [
            {
                firstName: "Alex",
                lastName: "Johnson",
                email: "alex.johnson" + Date.now() + "@example.com",
                password: hashedPassword,
                imageUpload: "sample_user_1.jpg",
                agreeTerms: true
            },
            {
                firstName: "Samantha",
                lastName: "Smith",
                email: "sam.smith" + Date.now() + "@example.com",
                password: hashedPassword,
                imageUpload: "sample_user_2.jpg",
                agreeTerms: true
            }
        ];

        const insertedUsers = await User.insertMany(users);
        console.log(`${insertedUsers.length} users inserted.`);

        const products = [
            {
                name: "Wireless Headphones",
                category: "Electronics",
                price: 199.99,
                discountPrice: 149.99,
                stock: 50,
                status: "Active",
                sku: "WH-" + Date.now() + "-1",
                description: "High-quality wireless headphones with noise cancellation.",
                imageUpload: "sample_product_1.jpg"
            },
            {
                name: "Running Shoes",
                category: "Fashion",
                price: 89.99,
                discountPrice: 0,
                stock: 120,
                status: "Active",
                sku: "RS-" + Date.now() + "-2",
                description: "Lightweight and comfortable running shoes for everyday use.",
                imageUpload: "sample_product_2.jpg"
            },
            {
                name: "Smart Watch",
                category: "Electronics",
                price: 299.99,
                discountPrice: 249.99,
                stock: 30,
                status: "Active",
                sku: "SW-" + Date.now() + "-3",
                description: "Track your fitness and stay connected with this smart watch.",
                imageUpload: "sample_product_3.jpg"
            },
            {
                name: "Coffee Mug",
                category: "Home & Kitchen",
                price: 14.99,
                discountPrice: 9.99,
                stock: 200,
                status: "Active",
                sku: "CM-" + Date.now() + "-4",
                description: "Ceramic coffee mug with a sleek design.",
                imageUpload: "sample_product_4.jpg"
            }
        ];

        const insertedProducts = await Product.insertMany(products);
        console.log(`${insertedProducts.length} products inserted.`);

        console.log("Database seeded successfully!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
