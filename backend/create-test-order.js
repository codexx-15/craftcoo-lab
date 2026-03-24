const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const createTestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email: 'craftcoo.lab@gmail.com' });
        if (!user) {
            console.error('User craftcoo.lab@gmail.com not found');
            process.exit(1);
        }

        const product = await Product.findOne();
        if (!product) {
            console.error('No products found in database. Run seed.js first.');
            process.exit(1);
        }

        const order = await Order.create({
            user: user._id,
            products: [{
                product: product._id,
                quantity: 1,
                price: product.price
            }],
            totalAmount: product.price,
            shippingAddress: '123 Test St, Craft City, 12345',
            paymentStatus: 'Paid',
            orderStatus: 'Pending'
        });

        console.log('Test Order Created Successfully:');
        console.log('Order ID:', order._id);
        console.log('User:', user.email);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating test order:', error);
        process.exit(1);
    }
};

createTestOrder();
