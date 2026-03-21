const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: 'Handcrafted with Love' },
        subtitle: { type: String, default: 'Unique pieces for your unique life.' },
        image: { type: String, default: '/images/hero-bg.png' },
        buttonText: { type: String, default: 'Shop Now' }
    },
    collections: [{
        title: { type: String, required: true },
        image: { type: String, required: true },
        slug: { type: String, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
