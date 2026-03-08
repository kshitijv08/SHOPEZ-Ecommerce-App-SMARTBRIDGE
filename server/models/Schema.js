const mongoose = require('mongoose');

// ──────────────────────── User Schema ────────────────────────
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usertype: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// ──────────────────────── Admin Schema ────────────────────────
const adminSchema = new mongoose.Schema({
    banner: { type: String, default: '' },
    categories: { type: Array, default: [] }
});

// ──────────────────────── Product Schema ────────────────────────
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    carousel: { type: [String], default: [] },
    sizes: { type: Array, default: [] },
    category: {
        type: String,
        required: true,
        enum: ['mobiles', 'electronics', 'sports-equipment', 'fashion', 'groceries']
    },
    gender: { type: String, enum: ['men', 'women', 'unisex', ''], default: '' },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 4.0 },
    reviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
});

// ──────────────────────── Order Schema ────────────────────────
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    discount: { type: Number },
    paymentMethod: {
        type: String,
        enum: ['cod', 'upi', 'card']
    },
    orderDate: { type: String },
    deliveryDate: { type: String },
    orderStatus: {
        type: String,
        default: 'order placed',
        enum: ['order placed', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled']
    }
});

// ──────────────────────── Cart Schema ────────────────────────
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    discount: { type: Number }
});

// ──────────────────────── Exports ────────────────────────
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Product = mongoose.model('Product', productSchema);
const Orders = mongoose.model('Orders', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { User, Admin, Product, Orders, Cart };
