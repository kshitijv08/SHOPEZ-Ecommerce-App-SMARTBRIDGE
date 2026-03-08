# 🛒 ShopEZ — Full-Stack MERN Ecommerce Application

> India's Smartest Shopping Destination — built with the MERN stack

![MERN](https://img.shields.io/badge/Stack-MERN-green) ![Vite](https://img.shields.io/badge/Frontend-Vite+React-blue) ![Node](https://img.shields.io/badge/Node-18%2B-brightgreen) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🖥️ Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 18 (Vite), React Router DOM v6, Axios |
| Backend  | Node.js, Express.js, Mongoose, JWT, bcryptjs|
| Database | MongoDB                                     |
| Icons    | react-icons (fi, bi, md)                    |
| Styling  | Vanilla CSS (Custom Design System)          |

## 🎨 Design System

ShopEZ features a custom-built, modern design identity inspired by platforms like Meesho and Myntra:

- **Primary Palette**: Purple-indigo (`#6c47ff`) with warm orange accent (`#ff6b35`)
- **White Navbar** with purple accent border — clean and premium feel
- **Purple Category Strip** — signature design element with icon + text
- **Split Hero Banner** — dark gradient CTA (left) + interactive "Hot Deals" mini-cards (right)
- **Circular Category Cards** — Myntra-style browsing experience
- **Redesigned Product Cards** — wishlist heart, side-by-side "Add to Cart" + "Buy" buttons, hover zoom
- **Minimal Footer** — trust badges + social icons in 2 clean rows

## ✨ Features

### User Features
- 🏠 Home page with split hero banner, Hot Deals panel, circular categories, deals of the day, and top picks
- 🔍 Product search, filter (category, gender, price range), and sort
- 📦 Product detail page with image gallery, size selector, and quantity controls
- 🛒 Cart with quantity controls and price summary (subtotal, discount, total)
- 💳 Checkout with delivery address form and payment options (COD / UPI / Card)
- 📋 Order confirmation with delivery estimate
- 👤 User profile with order history table
- ❤️ Wishlist toggle on product cards (visual feature)

### Admin Features
- 📊 Dashboard with stats cards (users, products, orders, revenue)
- 📦 Full product CRUD (add / edit / soft-delete) with modal form
- 📋 Order status management (placed → processing → shipped → delivered)
- 👥 User management with delete capability
- 🖼️ Banner image settings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd shopez

# 2. Install all dependencies
npm run install-all

# 3. Configure environment
# Edit server/.env with your MongoDB URI

# 4. Seed the database
npm run seed

# 5. Start development servers (frontend + backend)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

## 🔑 Demo Credentials

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@shopez.com  | Admin@123 |
| User  | user@shopez.com   | User@123  |

## 📡 API Endpoints

| Method | Endpoint               | Description          | Auth    |
|--------|------------------------|----------------------|---------|
| POST   | /api/auth/register     | Register user        | —       |
| POST   | /api/auth/login        | Login user           | —       |
| GET    | /api/auth/me           | Current user         | ✅      |
| GET    | /api/products          | All products         | —       |
| GET    | /api/products/:id      | Single product       | —       |
| POST   | /api/products          | Add product          | Admin   |
| PUT    | /api/products/:id      | Update product       | Admin   |
| DELETE | /api/products/:id      | Soft-delete product  | Admin   |
| GET    | /api/cart              | Get cart             | ✅      |
| POST   | /api/cart              | Add to cart          | ✅      |
| PUT    | /api/cart/:id          | Update cart item     | ✅      |
| DELETE | /api/cart/:id          | Remove cart item     | ✅      |
| DELETE | /api/cart/clear        | Clear cart           | ✅      |
| POST   | /api/orders            | Place order          | ✅      |
| GET    | /api/orders/my-orders  | User's orders        | ✅      |
| GET    | /api/orders/:id        | Single order         | ✅      |
| GET    | /api/admin/orders      | All orders           | Admin   |
| PUT    | /api/admin/orders/:id  | Update order status  | Admin   |
| GET    | /api/admin/users       | All users            | Admin   |
| DELETE | /api/admin/users/:id   | Delete user          | Admin   |
| GET    | /api/admin/stats       | Dashboard stats      | Admin   |
| POST   | /api/admin/banner      | Update banner        | Admin   |
| GET    | /api/admin/banner      | Get banner           | Admin   |

## 📁 Folder Structure

```
shopez/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, ProductCard, FilterSidebar, CartDrawer,
│   │   │                    # Footer, ProtectedRoute, AdminRoute, Loader, Toast
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── pages/           # Home, Products, ProductDetail, Login, Register,
│   │   │                    # Cart, Checkout, OrderConfirmation, Profile, AdminDashboard
│   │   ├── services/        # Axios API service with JWT interceptors
│   │   ├── App.jsx          # Root component with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Complete design system (~500 lines)
│   ├── index.html
│   └── vite.config.js
├── server/                  # Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # auth, product, order, cart, admin controllers
│   ├── middleware/           # JWT auth, admin guard, error handler
│   ├── models/Schema.js     # All Mongoose schemas in one file
│   ├── routes/              # auth, products, orders, cart, admin routes
│   ├── index.js             # Server entry point
│   └── seed.js              # Database seeder (20 products, demo users)
├── package.json             # Root scripts (dev, install-all, seed)
└── README.md
```

## ⚠️ Known Limitations
- Payment processing is simulated (no real payment gateway integration)
- No image upload — products use Unsplash URLs
- No email verification or password reset flow
- Wishlist is visual-only (not persisted to database)
- No real-time inventory tracking

## 📜 License

MIT — Educational project
