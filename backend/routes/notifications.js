const router = require('express').Router();
const { getNotifications, createNotification, markAsRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getNotifications);
router.post('/', protect, adminOnly, createNotification);
router.put('/mark-all-read', protect, adminOnly, markAllRead);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteNotification);

module.exports = router;
