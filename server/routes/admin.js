const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    deleteUser,
    getStats,
    updateBanner,
    getBanner,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect, admin);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.post('/banner', updateBanner);
router.get('/banner', getBanner);

module.exports = router;
