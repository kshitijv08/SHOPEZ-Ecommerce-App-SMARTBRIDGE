const { Cart } = require('../models/Schema');

// @desc   Get user's cart
// @route  GET /api/cart
const getCart = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const cartItems = await Cart.find({ userId });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Add item to cart
// @route  POST /api/cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { title, description, mainImg, size, quantity, price, discount } = req.body;

        const existingItem = await Cart.findOne({ userId, title, size });
        if (existingItem) {
            existingItem.quantity += (quantity || 1);
            await existingItem.save();
            return res.json(existingItem);
        }

        const cartItem = await Cart.create({
            userId,
            title,
            description,
            mainImg,
            size,
            quantity: quantity || 1,
            price,
            discount,
        });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update cart item quantity
// @route  PUT /api/cart/:id
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
    try {
        const cartItem = await Cart.findByIdAndDelete(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Clear entire cart
// @route  DELETE /api/cart/clear
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        await Cart.deleteMany({ userId });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
