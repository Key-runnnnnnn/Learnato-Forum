const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required']
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      trim: true
    },
    author: {
      type: String,
      default: 'Anonymous',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries by postId
replySchema.index({ postId: 1, createdAt: 1 });

module.exports = mongoose.model('Reply', replySchema);
