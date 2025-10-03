module.exports = {
  createNotification: async (data) => await Notification.create(data),

  getNotificationsByUser: async (userId) =>
    await Notification.find({ recipientId: userId }).sort({ createdAt: -1 })
};

require('dotenv').config();
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, {versionKey: false}
);

module.exports = mongoose.model('Notification', notificationSchema);