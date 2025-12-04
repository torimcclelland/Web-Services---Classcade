const mongoose = require('mongoose');

const readReceiptSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readAt: { type: Date, default: Date.now }
}, { _id: false });

const reactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // ex: like, heart, lol
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const attachmentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileSize: { type: Number, required: true }, // in bytes
    mimeType: { type: String, required: true },
    url: { type: String, required: true }, // Storage URL
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const chatSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }, // groups/rooms/DM thread
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', index: true }, // for channel support
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: false }, 

    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // reply-to
    repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },

    attachments: [attachmentSchema],

    // reactions and read receipts
    reactions: [reactionSchema],
    readBy: [readReceiptSchema],

    // flags
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
}, { timestamps: true });

chatSchema.index({ conversationId: 1, createdAt: 1 });
chatSchema.index({ channelId: 1, createdAt: 1 });
chatSchema.index({ sender: 1, createdAt: -1 });

chatSchema.pre('validate', function (next) {
    if (!this.content && (!this.attachments || this.attachments.length === 0)) {
        next(new Error('Message must have either content or attachments'));
    } else {
        next();
    }
});

chatSchema.set('toJSON', {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

const Chat = mongoose.model('Chat', chatSchema, 'Chat');

module.exports = Chat;
