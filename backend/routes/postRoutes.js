const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  addReply,
  upvotePost,
  downvotePost,
  markAsAnswered,
  searchPosts
} = require('../controllers/postController');

// Search route (must be before /:id to avoid conflict)
router.get('/search/:keyword', searchPosts);

// Post routes
router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Reply route
router.post('/:id/reply', addReply);

// Upvote route
router.post('/:id/upvote', upvotePost);

// Downvote route
router.post('/:id/downvote', downvotePost);

// Mark as answered route
router.patch('/:id/answer', markAsAnswered);

module.exports = router;
