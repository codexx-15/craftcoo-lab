const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        isCustom: { type: Boolean, default: false },
        price: { type: Number },
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
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
