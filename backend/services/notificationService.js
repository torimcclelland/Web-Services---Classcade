const Notification = require('../models/notification');

const createNotification = (data) => Notification.create(data);

const getNotificationsByUser = (userId) =>
  Notification.find({ recipientId: userId }).sort({ createdAt: -1 });

module.exports = {
  createNotification,
  getNotificationsByUser,
};
