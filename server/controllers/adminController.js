const { User, Orders, Product, Admin } = require('../models/Schema');

// @desc   Get all orders (admin)
// @route  GET /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find().sort({ _id: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update order status (admin)
// @route  PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all users (admin)
// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ _id: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete user (admin)
// @route  DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get admin stats
// @route  GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Orders.countDocuments();
        const totalProducts = await Product.countDocuments({ isActive: true });

        const revenueAgg = await Orders.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                { $subtract: ['$price', { $multiply: ['$price', { $divide: ['$discount', 100] }] }] },
                                '$quantity',
                            ],
                        },
                    },
                },
            },
        ]);
        const totalRevenue = revenueAgg.length > 0 ? Math.round(revenueAgg[0].totalRevenue) : 0;

        res.json({ totalUsers, totalOrders, totalRevenue, totalProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update banner
// @route  POST /api/admin/banner
const updateBanner = async (req, res) => {
    try {
        const { banner } = req.body;
        let adminDoc = await Admin.findOne();
        if (!adminDoc) {
            adminDoc = await Admin.create({ banner });
        } else {
            adminDoc.banner = banner;
            await adminDoc.save();
        }
        res.json(adminDoc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get banner
// @route  GET /api/admin/banner
const getBanner = async (req, res) => {
    try {
        const adminDoc = await Admin.findOne();
        res.json({ banner: adminDoc ? adminDoc.banner : '' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllOrders, updateOrderStatus, getAllUsers, deleteUser, getStats, updateBanner, getBanner };
