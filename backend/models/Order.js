const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        isCustom: { type: Boolean, default: false },
        customDetails: {
            type: { type: String },
            style: { type: String },
            size: { type: String },
            description: { type: String },
            referenceImage: { type: String },
            frame: { type: Boolean },
            extraCharacter: { type: Boolean },
            fastDelivery: { type: Boolean }
        }
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    shippingAddress: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
