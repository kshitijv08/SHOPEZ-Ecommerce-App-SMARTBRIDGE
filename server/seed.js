require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Product, Admin } = require('./models/Schema');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopez_ecommerce';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Admin.deleteMany({});
        console.log('Cleared existing data');

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('Admin@123', salt);
        const userPass = await bcrypt.hash('User@123', salt);

        // Create users
        await User.create([
            { username: 'Admin', email: 'admin@shopez.com', password: adminPass, usertype: 'admin' },
            { username: 'John Doe', email: 'user@shopez.com', password: userPass, usertype: 'user' },
        ]);
        console.log('Users seeded');

        // Create admin settings
        await Admin.create({
            banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
            categories: ['mobiles', 'electronics', 'sports-equipment', 'fashion', 'groceries'],
        });
        console.log('Admin settings seeded');

        // Create products
        const products = [
            {
                title: 'iPhone 14 Pro',
                description: 'Apple iPhone 14 Pro with A16 Bionic chip, 48MP camera system, Dynamic Island, and always-on display. Experience the best of Apple innovation.',
                mainImg: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600',
                    'https://images.unsplash.com/photo-1591337676887-a217a6c6a7a3?w=600',
                ],
                category: 'mobiles',
                gender: 'unisex',
                price: 129999,
                discount: 10,
                stock: 50,
                rating: 4.7,
                reviews: 2340,
            },
            {
                title: 'Samsung Galaxy S23',
                description: 'Samsung Galaxy S23 with Snapdragon 8 Gen 2 processor, 50MP triple camera, 120Hz AMOLED display, and 3900mAh battery.',
                mainImg: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
                ],
                category: 'mobiles',
                gender: 'unisex',
                price: 74999,
                discount: 15,
                stock: 80,
                rating: 4.5,
                reviews: 1890,
            },
            {
                title: 'OnePlus 11',
                description: 'OnePlus 11 with Snapdragon 8 Gen 2, Hasselblad camera, 100W fast charging, and 6.7" 2K AMOLED display.',
                mainImg: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
                ],
                category: 'mobiles',
                gender: 'unisex',
                price: 56999,
                discount: 8,
                stock: 120,
                rating: 4.4,
                reviews: 1456,
            },
            {
                title: 'Sony Headphones WH-1000XM5',
                description: 'Sony WH-1000XM5 premium wireless noise cancelling headphones with 30-hour battery life, superior sound quality, and multi-point connectivity.',
                mainImg: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
                ],
                category: 'electronics',
                gender: 'unisex',
                price: 29990,
                discount: 20,
                stock: 200,
                rating: 4.8,
                reviews: 3456,
            },
            {
                title: 'Apple iPad Air',
                description: 'Apple iPad Air with M1 chip, 10.9" Liquid Retina display, 12MP front and back cameras, Touch ID, and all-day battery life.',
                mainImg: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
                ],
                category: 'electronics',
                gender: 'unisex',
                price: 59900,
                discount: 5,
                stock: 60,
                rating: 4.6,
                reviews: 2100,
            },
            {
                title: 'Dell XPS 15 Laptop',
                description: 'Dell XPS 15 with 12th Gen Intel Core i7, 16GB RAM, 512GB SSD, 15.6" OLED 3.5K display, and NVIDIA GeForce RTX 3050.',
                mainImg: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
                ],
                category: 'electronics',
                gender: 'unisex',
                price: 149990,
                discount: 12,
                stock: 30,
                rating: 4.5,
                reviews: 890,
            },
            {
                title: 'Realme Buds Air',
                description: 'Realme Buds Air wireless earbuds with active noise cancellation, 25-hour battery, IPX5 water resistance, and 10mm dynamic bass driver.',
                mainImg: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600',
                ],
                category: 'electronics',
                gender: 'unisex',
                price: 3999,
                discount: 35,
                stock: 500,
                rating: 4.2,
                reviews: 5678,
            },
            {
                title: 'Cricket Bat — MRF',
                description: 'MRF Genius Grand Edition English Willow cricket bat. Used by professionals worldwide. Lightweight with excellent stroke play.',
                mainImg: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600',
                ],
                category: 'sports-equipment',
                gender: 'unisex',
                price: 1699,
                discount: 23,
                stock: 150,
                rating: 4.3,
                reviews: 420,
            },
            {
                title: 'Football — Nike',
                description: 'Nike Premier League official match football. FIFA Quality Pro certified. Thermally bonded panels for consistent feel and trajectory.',
                mainImg: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600',
                ],
                category: 'sports-equipment',
                gender: 'unisex',
                price: 2499,
                discount: 18,
                stock: 200,
                rating: 4.4,
                reviews: 678,
            },
            {
                title: 'Yoga Mat',
                description: 'Premium non-slip yoga mat with alignment lines. 6mm thick, eco-friendly TPE material, perfect for all types of yoga and floor exercises.',
                mainImg: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
                ],
                category: 'sports-equipment',
                gender: 'unisex',
                price: 1299,
                discount: 30,
                stock: 300,
                rating: 4.1,
                reviews: 890,
            },
            {
                title: "Men's Casual Shirt",
                description: "Premium cotton casual shirt for men. Comfortable fit, breathable fabric, perfect for everyday wear. Available in multiple sizes.",
                mainImg: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                category: 'fashion',
                gender: 'men',
                price: 1499,
                discount: 40,
                stock: 400,
                rating: 4.2,
                reviews: 1234,
            },
            {
                title: "Women's Kurti",
                description: "Elegant cotton kurti with traditional embroidery. Comfortable and stylish for both casual and festive occasions.",
                mainImg: 'https://images.unsplash.com/photo-1614093302611-8efc4de12964?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1614093302611-8efc4de12964?w=600',
                ],
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                category: 'fashion',
                gender: 'women',
                price: 999,
                discount: 50,
                stock: 350,
                rating: 4.5,
                reviews: 2100,
            },
            {
                title: "Men's Running Shoes — Nike",
                description: "Nike Air Zoom Pegasus running shoes for men. Responsive cushioning, breathable mesh, and durable rubber outsole.",
                mainImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
                ],
                sizes: ['6', '7', '8', '9', '10', '11'],
                category: 'fashion',
                gender: 'men',
                price: 7999,
                discount: 25,
                stock: 180,
                rating: 4.6,
                reviews: 3456,
            },
            {
                title: "Women's Handbag",
                description: "Premium leather handbag for women. Spacious compartments, sturdy handles, and elegant design for every occasion.",
                mainImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
                ],
                category: 'fashion',
                gender: 'women',
                price: 2499,
                discount: 35,
                stock: 120,
                rating: 4.3,
                reviews: 780,
            },
            {
                title: 'Unisex Hoodie',
                description: 'Premium fleece pullover hoodie. Soft inner lining, kangaroo pocket, and adjustable drawstring hood. Perfect for layering.',
                mainImg: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
                ],
                sizes: ['S', 'M', 'L', 'XL'],
                category: 'fashion',
                gender: 'unisex',
                price: 1999,
                discount: 20,
                stock: 250,
                rating: 4.4,
                reviews: 1567,
            },
            {
                title: 'Basmati Rice — India Gate',
                description: 'India Gate Classic Basmati Rice. Extra long grain, aged rice with rich aroma. Perfect for biryani and pulao.',
                mainImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
                ],
                sizes: ['1kg', '5kg', '10kg'],
                category: 'groceries',
                price: 499,
                discount: 10,
                stock: 1000,
                rating: 4.5,
                reviews: 4567,
            },
            {
                title: 'Organic Almonds',
                description: 'Premium California organic almonds. Rich in protein, fiber, and healthy fats. Perfect for snacking and cooking.',
                mainImg: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600',
                ],
                sizes: ['250g', '500g', '1kg'],
                category: 'groceries',
                price: 899,
                discount: 15,
                stock: 600,
                rating: 4.6,
                reviews: 2345,
            },
            {
                title: 'Cold Pressed Olive Oil',
                description: 'Extra virgin cold pressed olive oil. Imported from Italy. Rich in antioxidants and heart-healthy monounsaturated fats.',
                mainImg: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
                ],
                category: 'groceries',
                price: 699,
                discount: 12,
                stock: 400,
                rating: 4.3,
                reviews: 890,
            },
            {
                title: 'Green Tea — 100 bags',
                description: 'Premium green tea bags with natural antioxidants. Refreshing taste, promotes metabolism, and helps in weight management.',
                mainImg: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
                ],
                category: 'groceries',
                price: 399,
                discount: 20,
                stock: 800,
                rating: 4.2,
                reviews: 1678,
            },
            {
                title: 'Dark Chocolate — Lindt',
                description: 'Lindt Excellence 70% cocoa dark chocolate. Smooth, rich, and intensely satisfying. Crafted by master chocolatiers.',
                mainImg: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400',
                carousel: [
                    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600',
                ],
                category: 'groceries',
                price: 599,
                discount: 8,
                stock: 450,
                rating: 4.7,
                reviews: 3210,
            },
        ];

        await Product.insertMany(products);
        console.log('Products seeded (20 items)');

        console.log('\n✅ Seed completed successfully!');
        console.log('Admin: admin@shopez.com / Admin@123');
        console.log('User:  user@shopez.com  / User@123\n');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedData();
