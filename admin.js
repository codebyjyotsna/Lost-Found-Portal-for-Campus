const express = require('express');
const router = express.Router();
const Post = require('./models/Post');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
}

// Get all pending posts
router.get('/api/admin/posts', isAdmin, async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Pending' });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Failed to fetch posts');
  }
});

// Approve a post
router.put('/api/admin/posts/:id/approve', isAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).send('Failed to approve post');
  }
});

// Reject a post
router.put('/api/admin/posts/:id/reject', isAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).send('Failed to reject post');
  }
});

module.exports = router;
