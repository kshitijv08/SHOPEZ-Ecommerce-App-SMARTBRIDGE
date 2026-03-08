const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/clear', protect, clearCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);

module.exports = router;
