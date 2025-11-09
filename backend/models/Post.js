const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    author: {
      type: String,
      default: 'Anonymous',
      trim: true
    },
    votes: {
      type: Number,
      default: 0
    },
    upvotedBy: [{
      type: String,
      trim: true
    }],
    downvotedBy: [{
      type: String,
      trim: true
    }],
    isAnswered: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
postSchema.index({ votes: -1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
