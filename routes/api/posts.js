const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get('/test', (req, res) => {
  res.json({msg: 'Posts accessed'});
});

// @route  GET api/posts
// @desc   Get posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({noposts: 'No posts found'}));
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopost: 'No post found with that ID'}));
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

// @route  DELETE api/posts/:id
// @desc   Delete post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Post.findOneAndDelete({ user: req.user.id, _id: req.params.id })
    .then(post => {
      // Check for post owner
      // if (post.user.toString() !== req.user.id) {
      //   return res.status(401).json({ notauthorized: 'User not authorized'});
      // }

      // Delete
      post.remove().then(() => res.json({ success: true}));
    })
    .catch(err => res.status(404).json({ error: 'Unable to delete post'}))
});

// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ alreadyliked: 'User has already liked this post'});
      }

      // Add user ID to likes array
      post.likes.unshift({ user: req.user.id });

      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ error: 'Unable to find post ID'}));
});

// @route  POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ alreadyliked: 'You have not liked this post yet'});
      }

      // Remove like from likes array
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);

      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ error: 'Unable to find post ID'}));
});

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      // Add to comments array
      post.comments.unshift(newComment);
      
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found with that ID'}));
});

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check for comment
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotfound: 'Comment not found'});
      }

      // Check for user's access to comment
      const removeIndex = post.comments
        .map(comment => comment._id.toString())
        .indexOf(req.params.comment_id);

      if (req.user.id !== post.comments[removeIndex].user.toString()) {
        return res.status(401).json({ notauthorized: "User not authorized" });
      }

      // Remove comment from array
      post.comments.splice(removeIndex, 1);

      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No comment found with that ID'}));
    // .catch(err => res.status(404).json(err));
});

module.exports = router;
