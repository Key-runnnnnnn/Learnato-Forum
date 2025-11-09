const Post = require('../models/Post');
const Reply = require('../models/Reply');

const createPost = async (req, res) => {
  try {
    const { title, content, author, userId } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to create a post'
      });
    }

    const post = await Post.create({
      title,
      content,
      author: author || 'Anonymous'
    });

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('newPost', post);
    }

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const { sortBy = 'votes', filterAnswered = 'all' } = req.query;

    let filterQuery = {};
    if (filterAnswered === 'answered') {
      filterQuery.isAnswered = true;
    } else if (filterAnswered === 'unanswered') {
      filterQuery.isAnswered = false;
    }

    let sortOption = {};
    if (sortBy === 'votes') {
      sortOption = { votes: -1, createdAt: -1 };
    } else if (sortBy === 'date') {
      sortOption = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'replies') {
      sortOption = { createdAt: -1 };
    }

    const posts = await Post.find(filterQuery).sort(sortOption);

    const postsWithReplyCounts = await Promise.all(
      posts.map(async (post) => {
        const replyCount = await Reply.countDocuments({ postId: post._id });
        return {
          ...post.toObject(),
          replyCount
        };
      })
    );

    if (sortBy === 'replies') {
      postsWithReplyCounts.sort((a, b) => b.replyCount - a.replyCount);
    }

    res.status(200).json({
      success: true,
      count: postsWithReplyCounts.length,
      data: postsWithReplyCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const replies = await Reply.find({ postId: req.params.id }).sort({ createdAt: 1 });

    // Include upvotedBy in response for frontend to check
    res.status(200).json({
      success: true,
      data: {
        post,
        replies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addReply = async (req, res) => {
  try {
    const { content, author, userId } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to post a reply'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const reply = await Reply.create({
      postId: req.params.id,
      content,
      author: author || 'Anonymous'
    });

    if (req.io) {
      req.io.emit('newReply', { postId: req.params.id, reply });
    }

    res.status(201).json({
      success: true,
      data: reply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const upvotePost = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required to upvote'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user has already upvoted
    if (post.upvotedBy && post.upvotedBy.includes(userId)) {
      // User already upvoted, so remove the upvote (toggle behavior)
      post.votes = Math.max(0, post.votes - 1);
      post.upvotedBy = post.upvotedBy.filter(id => id !== userId);
      await post.save();

      if (req.io) {
        req.io.emit('postUpvoted', { postId: post._id, votes: post.votes });
      }

      return res.status(200).json({
        success: true,
        message: 'Upvote removed',
        data: post,
        hasUpvoted: false
      });
    }

    // Remove downvote if exists
    if (post.downvotedBy && post.downvotedBy.includes(userId)) {
      post.votes += 1;
      post.downvotedBy = post.downvotedBy.filter(id => id !== userId);
    }

    // Add upvote
    post.votes += 1;
    if (!post.upvotedBy) {
      post.upvotedBy = [];
    }
    post.upvotedBy.push(userId);
    await post.save();

    if (req.io) {
      req.io.emit('postUpvoted', { postId: post._id, votes: post.votes });
    }

    res.status(200).json({
      success: true,
      message: 'Upvoted successfully',
      data: post,
      hasUpvoted: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const downvotePost = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required to downvote'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user has already downvoted
    if (post.downvotedBy && post.downvotedBy.includes(userId)) {
      // User already downvoted, so remove the downvote (toggle behavior)
      post.votes += 1;
      post.downvotedBy = post.downvotedBy.filter(id => id !== userId);
      await post.save();

      if (req.io) {
        req.io.emit('postUpvoted', { postId: post._id, votes: post.votes });
      }

      return res.status(200).json({
        success: true,
        message: 'Downvote removed',
        data: post,
        hasDownvoted: false
      });
    }

    // Remove upvote if exists
    if (post.upvotedBy && post.upvotedBy.includes(userId)) {
      post.votes -= 1;
      post.upvotedBy = post.upvotedBy.filter(id => id !== userId);
    }

    // Add downvote
    post.votes -= 1;
    if (!post.downvotedBy) {
      post.downvotedBy = [];
    }
    post.downvotedBy.push(userId);
    await post.save();

    if (req.io) {
      req.io.emit('postUpvoted', { postId: post._id, votes: post.votes });
    }

    res.status(200).json({
      success: true,
      message: 'Downvoted successfully',
      data: post,
      hasDownvoted: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const markAsAnswered = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.isAnswered = !post.isAnswered;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const searchPosts = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    }).sort({ votes: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  addReply,
  upvotePost,
  downvotePost,
  markAsAnswered,
  searchPosts
};
