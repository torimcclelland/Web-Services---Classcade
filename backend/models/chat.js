const mongoose = require('mongoose');

const readReceiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  readAt: { type: Date, default: Date.now }
}, { _id: false }, { versionKey: false });

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // ex: like, heart, lol
  createdAt: { type: Date, default: Date.now }
}, { _id: false }, { versionKey: false });

const chatSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }, // groups/rooms/DM thread
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },

  // recipients can be useful for group messages. Otherwise just use conversationId
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // reply-to
  repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },

  // reactions and read receipts
  reactions: [reactionSchema],
  readBy: [readReceiptSchema],

  // flags
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
}, { timestamps: true }, { versionKey: false });

chatSchema.index({ conversationId: 1, createdAt: 1 });
chatSchema.index({ sender: 1, createdAt: -1 });

chatSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Chat = mongoose.model('Chat', chatSchema, 'Chat');

module.exports = Chat;