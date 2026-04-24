# E-commerce with ML (MERN Stack)

A comprehensive, full-stack E-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js) with integrated Machine Learning capabilities for personalized product recommendations and sentiment-based review analysis.

## 🚀 Features

### 🛍️ Customer Storefront
- **Dynamic Product Browsing**: Seamlessly browse products with paginated results, category filtering, and search functionality.
- **Product Details**: High-quality product views with multiple images, detailed descriptions, and live stock status.
- **AI Recommendations**: Personalized "Products you may also like" section powered by an item-based collaborative filtering algorithm.
- **Smart Shopping Cart**: Efficient cart management with real-time price updates.
- **Wishlist**: Save favorite products for later with a dedicated wishlist view.
- **Secure Checkout**: Integrated **Stripe** payment gateway for secure credit card transactions.
- **Order Tracking**: Detailed order history and live status updates (Order Placed, Shipped, Delivered).

### 🤖 Intelligent Features
- **Recommendation Engine**: Custom-built Item-based Collaborative Filtering using Cosine Similarity to suggest products based on user purchase patterns.
- **Sentiment Analysis**: Automatic sentiment classification for user reviews (Positive, Neutral, Negative) to help customers and admins gauge feedback.
- **Chatbot Support**: AI-driven chatbot to assist users with common queries and navigation.
- **SMS Notifications**: Real-time order confirmations and status updates sent via **Twilio**.

### 🛠️ Admin Dashboard
- **Comprehensive Analytics**: Overview of sales, total users, and product performance.
- **Inventory Management**: Full CRUD operations for products, including image uploads and stock management.
- **Order Processing**: Manage customer orders, update shipping statuses, and view transaction details.
- **User Moderation**: Manage user accounts and review content.

### 🔐 Security & Reliability
- **JWT Authentication**: Secure login and registration with JSON Web Tokens.
- **Email Verification**: Link-based email verification using **Nodemailer** to ensure valid user accounts.
- **Role-Based Access Control (RBAC)**: Strict separation between customer and administrative functionalities.
- **Containerized Environment**: Fully Dockerized setup for easy deployment and scalability.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Axios, Framer Motion (Animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Payments**: Stripe API.
- **Notifications**: Twilio (SMS), Nodemailer (Email).
- **Machine Learning**: Item-based Collaborative Filtering (Custom JS), Sentiment Analysis logic.
- **DevOps**: Docker, Docker Compose.

---

## 📁 Project Structure

```bash
ecommerce-with-ml/
├── mongodb/                # Backend (Node.js API)
│   ├── controller/         # Business logic (Auth, Products, ML, Orders)
│   ├── modules/            # Mongoose Schema Definitions
│   ├── router/             # API Endpoint Routing
│   ├── utils/              # Helper functions (SMS, Email, Sentiment)
│   └── uploads/            # Product image storage
├── react_frontend/         # Frontend (React App)
│   ├── src/
│   │   ├── admin/          # Admin Dashboard Components & Pages
│   │   ├── components/     # Reusable UI Components
│   │   └── pages/          # Customer-facing Pages (Shop, Cart, Profile)
├── docker-compose.yml      # Orchestration for MongoDB, Backend, and Frontend
└── README.md               # You are here
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (Optional, for containerized run)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecommerce-with-ml.git
   cd ecommerce-with-ml
   ```

2. **Backend Setup:**
   ```bash
   cd mongodb
   # Create a .env file and fill in your credentials (see .env section)
   npm install
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../react_frontend
   # Create a .env file and point to back-end URL
   npm install
   npm start
   ```

### 🐳 Running with Docker

You can spin up the entire stack (Database, Backend, Frontend) with a single command:

```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

### Backend (`/mongodb/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`/react_frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 📈 ML Recommendation System Logic

The recommendation engine uses **Item-based Collaborative Filtering**:
1. **User-Item Matrix**: Processes order history to determine product weights for each user.
2. **Cosine Similarity**: Calculates the similarity score between products based on co-purchase patterns.
3. **Hybrid Fallback**: If a product has no purchase history (Cold Start), the system falls back to **Content-Filtered** logic (Category Match + Popularity).

---

## 👤 Author

**Iyan**  
Graduate Student | Full Stack Developer | ML Enthusiast

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
