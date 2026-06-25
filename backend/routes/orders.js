const router = require('express').Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/stats/dashboard', protect, adminOnly, getDashboardStats);
router.get('/:id', protect, adminOnly, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
