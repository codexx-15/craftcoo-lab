const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
    const { products, totalAmount, shippingAddress } = req.body;
    try {
        const order = await Order.create({
            user: req.user._id,
            products,
            totalAmount,
            shippingAddress,
            paymentStatus: 'Pending' // Default to pending as we skip payment gateway
        });

        // Update stock immediately for demo purposes if no payment gateway
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        res.status(201).json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify payment (Dummy for now as we removed Razorpay)
exports.verifyPayment = async (req, res) => {
    res.json({ message: 'Payment verification skipped' });
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.orderStatus = req.body.status;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
