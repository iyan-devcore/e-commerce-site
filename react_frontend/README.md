# 🛒 E-commerce with ML (MERN Stack)

A modern, responsive e-commerce application built using the MERN stack (MongoDB, Express, React, Node.js). This project aims to integrate Machine Learning features for enhanced user experience (recommendations, analytics) in the future.

## 🚀 Project Overview

This repository contains the source code for a full-stack e-commerce platform. It currently features a polished, responsive frontend with a user-friendly interface and a comprehensive admin dashboard. The backend is set up with Express and MongoDB support, ready for further API development.

### Key Features
*   **Modern UI/UX:** Built with React and Tailwind CSS for a sleek, responsive design.
*   **Admin Dashboard:**
    *   Overview with key statistics (Revenue, Orders, Customers).
    *   **Products Management:** View, search, and filter product inventory.
    *   **Orders Management:** Track status of customer orders.
    *   Sidebar navigation and responsive layout.
*   **Customer Features:**
    *   Home page with Hero section, Featured Categories, and Best Sellers.
    *   Product listings (placeholder).
    *   User Authentication pages (Login/Register).
    *   Shopping Cart and Wishlist UI.
*   **Backend Foundation:** Node.js and Express server with MongoDB connection setup (Mongoose).

## 🛠️ Tech Stack

### Frontend (`/react_frontend`)
*   **React** (v19)
*   **React Router** (for navigation)
*   **Tailwind CSS** (for styling)
*   **Icons:** Heroicons / SVG

### Backend (`/mongodb`)
*   **Node.js**
*   **Express.js**
*   **MongoDB** (with Mongoose)
*   **CORS & Body-Parser**

## 📂 Project Structure

```
/ecommerce with ML
├── /mongodb             # Backend Node.js/Express application
│   ├── app.js           # Server entry point
│   └── package.json     # Backend dependencies
│
└── /react_frontend      # Frontend React application
    ├── /public          # Static assets
    ├── /src
    │   ├── /components  # Reusable UI components
    │   │   ├── /admin   # Admin dashboard pages (Products, Orders)
    │   │   └── ...      # Customer-facing components (Home, Login, etc.)
    │   ├── App.js       # Main application component & Routing
    │   └── ...
    └── package.json     # Frontend dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js installed on your machine.
*   MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd mongodb
npm install
```

Start the backend server:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:

```bash
cd ../react_frontend
npm install
```

Start the React development server:

```bash
npm start
# App runs on http://localhost:3000
```

## 🗺️ Roadmap

*   [ ] **Connect Frontend to Backend:** specific API endpoints for products and users.
*   [ ] **Database Integration:** Store real product and user data in MongoDB.
*   [ ] **Authentication:** Implement JWT-based auth in the backend.
*   [ ] **Machine Learning:** Integrate ML models for product recommendations and sales forecasting.
*   [ ] **Payment Gateway:** Integrate Stripe or Razorpay.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
