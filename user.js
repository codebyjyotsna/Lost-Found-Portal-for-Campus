const express = require('express');
const router = express.Router();
const Post = require('./models/Post');

// Get posts created by the logged-in user
router.get('/api/user/posts', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Failed to fetch user posts');
  }
});

// Edit a post
router.put('/api/user/posts/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).send('Failed to update post');
  }
});

// Delete a post
router.delete('/api/user/posts/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Post deleted successfully', post });
  } catch (error) {
    res.status(500).send('Failed to delete post');
  }
});

module.exports = router;
