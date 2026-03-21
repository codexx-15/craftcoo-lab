const express = require('express');
const { createOrder, verifyPayment, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/admin', protect, admin, getAllOrders);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;
