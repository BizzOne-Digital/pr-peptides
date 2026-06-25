const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error', 'order', 'product'], default: 'info' },
  targetAudience: { type: String, enum: ['all', 'subscribers', 'admin'], default: 'all' },
  isRead: { type: Boolean, default: false },
  sentViaEmail: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
