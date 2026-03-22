const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
} else {
    console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payments will not work.');
}

// Create order
exports.createOrder = async (req, res) => {
    const { products, totalAmount, shippingAddress } = req.body;
    try {
        if (!razorpay) {
            return res.status(400).json({ message: 'Payment gateway is not configured yet. Please try again later.' });
        }
        const order = await Order.create({
            user: req.user._id,
            products,
            totalAmount,
            shippingAddress
        });
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: order._id.toString()
        });
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
        res.status(201).json({ order, razorpayOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order (Admin)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    try {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const generatedSignature = hmac.digest('hex');
        if (generatedSignature === razorpaySignature) {
            const order = await Order.findOne({ razorpayOrderId });
            if (order) {
                order.paymentStatus = 'Paid';
                order.razorpayPaymentId = razorpayPaymentId;
                await order.save();

                // Update stock
                for (const item of order.products) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.stock -= item.quantity;
                        await product.save();
                    }
                }
                res.json({ message: 'Payment verified successfully' });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
