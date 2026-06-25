const router = require('express').Router();
const { subscribe, getSubscribers, unsubscribe } = require('../controllers/subscriberController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', subscribe);
router.get('/', protect, adminOnly, getSubscribers);
router.delete('/:id', protect, adminOnly, unsubscribe);

module.exports = router;
