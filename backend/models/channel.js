const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        default: '',
        maxlength: 200
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

// Compound index for efficient queries
channelSchema.index({ projectId: 1, createdAt: 1 });
channelSchema.index({ projectId: 1, name: 1 });

// Transform _id to id in JSON responses
channelSchema.set('toJSON', {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Channel = mongoose.model('Channel', channelSchema, 'Channel');

module.exports = Channel;
