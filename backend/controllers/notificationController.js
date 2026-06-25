const Notification = require('../models/Notification');
const Subscriber = require('../models/Subscriber');
const sendSSE = require('../utils/sendSSE');
const { sendEmail, notificationEmailHTML } = require('../utils/email');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetAudience, sendEmail: doSendEmail } = req.body;
    const notification = await Notification.create({ title, message, type, targetAudience, createdBy: req.user._id });
    
    // Broadcast via SSE
    sendSSE({ type: 'notification', title, message, notificationType: type, id: notification._id });
    
    // Send emails to subscribers
    if (doSendEmail && targetAudience !== 'admin') {
      const subscribers = await Subscriber.find({ isActive: true });
      const emailPromises = subscribers.map(sub =>
        sendEmail({ to: sub.email, subject: title, html: notificationEmailHTML(notification) })
      );
      await Promise.allSettled(emailPromises);
      notification.sentViaEmail = true;
      await notification.save();
    }
    
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
