const SiteSettings = require('../models/SiteSettings');

// Get site settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({
                hero: {
                    title: '#ART COLLECTION',
                    subtitle: "Handmade paintings & creative prints you'll love",
                    image: '/images/hero1.png',
                    buttonText: 'Shop Now'
                },
                collections: [
                    { title: 'Paintings', image: '/images/paintings.png', slug: 'paintings' },
                    { title: 'Custom Paintings', image: '/images/custom-paintings.png', slug: 'custom-paintings' },
                    { title: 'Bookmarks', image: '/images/bookmarks.png', slug: 'bookmarks' },
                    { title: 'Postcards', image: '/images/postcards.png', slug: 'postcards' }
                ]
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update site settings (Admin)
exports.updateSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (settings) {
            if (req.body.hero) settings.hero = { ...settings.hero, ...req.body.hero };
            if (req.body.collections) settings.collections = req.body.collections;
            await settings.save();
        } else {
            settings = await SiteSettings.create(req.body);
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
