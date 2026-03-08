const { Orders } = require('../models/Schema');

// @desc   Place order
// @route  POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const { items, name, email, mobile, address, pincode, paymentMethod } = req.body;
        const userId = req.user._id.toString();

        const today = new Date();
        const delivery = new Date(today);
        delivery.setDate(delivery.getDate() + 5);

        const orderDate = today.toISOString().split('T')[0];
        const deliveryDate = delivery.toISOString().split('T')[0];

        const orders = [];
        for (const item of items) {
            const order = await Orders.create({
                userId,
                name,
                email,
                mobile,
                address,
                pincode,
                title: item.title,
                description: item.description,
                mainImg: item.mainImg,
                size: item.size || '',
                quantity: item.quantity || 1,
                price: item.price,
                discount: item.discount,
                paymentMethod,
                orderDate,
                deliveryDate,
                orderStatus: 'order placed',
            });
            orders.push(order);
        }

        res.status(201).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get current user's orders
// @route  GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const orders = await Orders.find({ userId }).sort({ _id: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single order
// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.userId !== req.user._id.toString() && req.user.usertype !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
