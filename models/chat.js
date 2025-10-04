const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // coming soon..
});

const Chat = mongoose.model('Chat', chatSchema, 'Chat');

module.exports = Chat;