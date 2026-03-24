const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        let query = {};

        // Keyword search
        if (req.query.keyword) {
            query.$or = [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { category: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }

        // Min price filter
        if (req.query.minPrice) {
            const minPriceVal = parseInt(req.query.minPrice);
            if (!isNaN(minPriceVal)) {
                query.price = { $gte: minPriceVal };
            }
        }

        // Limited edition filter logic
        if (req.query.isLimitedEdition === 'true') {
            // Explicitly requested only limited edition
            query.isLimitedEdition = true;
        } else if (req.query.includeLimited === 'true') {
            // Admin or special view: DO NOT add any filter for limited edition (shows everything)
            console.log('[Backend] Fetching all products (including limited)');
        } else if (req.query.minPrice) {
            // Price filter view: Show regular products that fit price
            query.isLimitedEdition = { $ne: true };
        } else {
            // Default store view: Hide limited edition drops
            query.isLimitedEdition = { $ne: true };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ 
            category: req.params.category,
            isLimitedEdition: { $ne: true } // Hide limited edition from category views
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add product (Admin)
exports.createProduct = async (req, res) => {
    const { name, description, price, category, image, images, stock, isLimitedEdition } = req.body;
    try {
        const product = await Product.create({ 
            name, 
            description, 
            price, 
            category, 
            image, 
            images, 
            stock, 
            isLimitedEdition: isLimitedEdition || false 
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product (Admin)
exports.updateProduct = async (req, res) => {
    try {
        const { isLimitedEdition, ...otherUpdates } = req.body;
        
        let updateData = { ...otherUpdates };
        
        // Explicitly handle isLimitedEdition if present
        if (isLimitedEdition !== undefined) {
            updateData.isLimitedEdition = (isLimitedEdition === true || isLimitedEdition === 'true');
            console.log(`[Admin Update] Setting isLimitedEdition to: ${updateData.isLimitedEdition} for product: ${req.params.id}`);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('[Admin Update Error]', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete product (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
