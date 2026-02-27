# 🛒 E-commerce Platform with ML (MERN Stack)

A modern, full-stack e-commerce application built using the MERN stack (MongoDB, Express, React, Node.js). This platform provides a complete shopping experience for customers and a robust administrative dashboard for store managers. It serves as a foundation for integrating Machine Learning features (like product recommendations and sales forecasting) in the future.

## 🚀 Project Overview

The project is divided into two primary domains, featuring a complete API backend and a responsive React frontend:

### 🛍️ Public-Facing Storefront (Customer Journey)
*   **Browsing & Navigation:** Users can browse through diverse categories (Smartphones, Fashion, Home & Living, Beauty, Accessories, Toys, Laptops, Audio).
*   **Product Interaction:** Detailed product pages showing extensive information, pricing, and dynamic imagery.
*   **Authentication Flow:** Secure user registration and login functionality allowing customers to manage their profiles.
*   **Modern UI:** Responsive design built with React and Tailwind CSS.

### 🛡️ Secure Admin Dashboard (Management Journey)
*   **Centralized Hub:** A dedicated dashboard providing a high-level overview of revenue, orders, and customer metrics.
*   **Product Management (CRUD):** Full capability to add, view, update, and delete products, including image uploads via Multer.
*   **Order Tracking:** Monitor and update customer orders (Pending, Processing, Shipped, Delivered).
*   **Customer Roster:** View and manage registered users on the platform.

### ⚙️ Robust Backend System (Node.js & MongoDB)
*   **RESTful APIs:** Fully functional endpoints connecting the React frontend to the MongoDB database for Users, Products, and Orders.
*   **Mongoose Modeling:** Structured data schemas (`Order.js`, `Product.js`, `Users.js`).
*   **Media Handling:** Integrated image upload handling.

## 🛠️ Tech Stack

### Frontend (`/react_frontend`)
*   **Build & UI:** React (v19), React Router DOM, React Icons
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React

### Backend (`/mongodb`)
*   **Server:** Node.js, Express.js
*   **Database:** MongoDB & Mongoose
*   **Middleware:** Cors, Multer (for file uploads)
*   **Security:** Bcrypt (for password hashing)

## 📂 Project Structure

```text
/ecommerce with ML
├── /mongodb                 # Backend Express application
│   ├── /controller          # Logic for Handling requests (Users, Products, Orders)
│   ├── /modules             # Mongoose schemas/models
│   ├── /router              # API Route definitions
│   └── app.js               # Main server entry file
│
└── /react_frontend          # Frontend React application
    ├── /public              # Static assets
    ├── /src
    │   ├── /admin           # Complete Admin Dashboard (Pages, Layouts, UI)
    │   ├── /components      # Customer-facing storefront components
    │   └── App.js           # Frontend routes and app shell
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

Start the backend server (typically runs on `http://localhost:5000`):

```bash
node app.js
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:

```bash
cd react_frontend
npm install
```

Start the React development server:

```bash
npm start
# The application will launch on http://localhost:3000
```

## 🗺️ Future Roadmap

*   [ ] **Machine Learning Integration:** Add recommendation engines and predictive analytics.
*   [ ] **Payment Gateway:** Integrate secure checkouts with Stripe or Razorpay.
*   [ ] **Advanced Analytics:** Detailed charts in the admin dashboard.
*   [ ] **JWT Authentication:** Upgrade token management for scalable security.

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome!
