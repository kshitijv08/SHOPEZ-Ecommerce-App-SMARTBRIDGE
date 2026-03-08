const { Product } = require('../models/Schema');

// @desc   Get all active products with filters
// @route  GET /api/products
const getProducts = async (req, res) => {
    try {
        const { search, category, gender, sort } = req.query;
        let query = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            const categories = category.split(',');
            query.category = { $in: categories };
        }

        if (gender) {
            const genders = gender.split(',');
            query.gender = { $in: genders };
        }

        let sortOption = {};
        switch (sort) {
            case 'price_low':
                sortOption = { price: 1 };
                break;
            case 'price_high':
                sortOption = { price: -1 };
                break;
            case 'discount':
                sortOption = { discount: -1 };
                break;
            case 'popular':
            default:
                sortOption = { rating: -1, reviews: -1 };
                break;
        }

        const products = await Product.find(query).sort(sortOption);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single product
// @route  GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Add product (admin)
// @route  POST /api/products
const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update product (admin)
// @route  PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Soft delete product (admin)
// @route  DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
