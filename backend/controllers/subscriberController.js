const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.json({ success: true, message: 'Resubscribed successfully' });
      }
      return res.status(400).json({ success: false, message: 'Already subscribed' });
    }
    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers, total: subscribers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    await Subscriber.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Unsubscribed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
