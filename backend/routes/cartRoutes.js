const express = require('express');
const { getCart, addToCart, updateQuantity, removeItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateQuantity);
router.delete('/:productId', protect, removeItem);

module.exports = router;
