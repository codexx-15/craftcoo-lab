const Cart = require('../models/Cart');

// Get user cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            const newCart = await Cart.create({ user: req.user._id, items: [] });
            return res.json(newCart);
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add to cart
exports.addToCart = async (req, res) => {
    const { productId, quantity, isCustom, price, customDetails } = req.body;
    console.log('Add to cart request:', { productId, quantity, isCustom, price, customDetails });
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ 
                user: req.user._id, 
                items: [{ product: productId, quantity, isCustom, price, customDetails }] 
            });
        } else {
            // For custom items, always add as a new item because details might differ
            if (isCustom) {
                cart.items.push({ product: productId, quantity, isCustom, price, customDetails });
            } else {
                const itemIndex = cart.items.findIndex(item => !item.isCustom && item.product.toString() === productId);
                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    cart.items.push({ product: productId, quantity });
                }
            }
            await cart.save();
        }
        const populatedCart = await cart.populate('items.product');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
    const { productId, quantity, index } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            let itemIndex = -1;
            if (index !== undefined) {
                itemIndex = index;
            } else {
                itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            }

            if (itemIndex > -1 && itemIndex < cart.items.length) {
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
                const populatedCart = await cart.populate('items.product');
                res.json(populatedCart);
            } else {
                res.status(404).json({ message: 'Item not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item
exports.removeItem = async (req, res) => {
    const { productId } = req.params;
    const { index } = req.query;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            if (index !== undefined) {
                cart.items.splice(parseInt(index), 1);
            } else {
                cart.items = cart.items.filter(item => item.product.toString() !== productId);
            }
            await cart.save();
            const populatedCart = await cart.populate('items.product');
            res.json(populatedCart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
