module.exports = {
  createNotification: async (data) => await Notification.create(data),

  getNotificationsByUser: async (userId) =>
    await Notification.find({ recipientId: userId }).sort({ createdAt: -1 })
};