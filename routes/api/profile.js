const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Profile input validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Profile model
const Profile = require('../../models/Profile');
// User model
const User = require('../../models/User');

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res) => {
  res.json({msg: 'Profile accessed'});
});

// @route  GET api/profile
// @desc   Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      errors.noprofile = 'There is no profile for this user';
      if (!profile) return res.status(404).json(errors);
      return res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile/all
// @desc   Get all user profiles
// @access Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      errors.noprofile = 'There are no profiles';
      if (!profiles && profiles.length === 0) return res.status(404).json(errors);
      res.json(profiles);
    })
    .catch(err => res.status(404).json({profile: 'No profiles found'}));
});

// @route  GET api/profile/handle/:handle
// @desc   Get user profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile found for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile/user/:user
// @desc   Get user profile by user ID
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json({profile: 'No profile found for this user'}));
});

// @route  POST api/profile
// @desc   Create/edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  // Get fields from body
  const profileInfo = {};
  profileInfo.user = req.user.id;
  if (req.body.handle) profileInfo.handle = req.body.handle;
  if (req.body.company) profileInfo.company = req.body.company;
  if (req.body.website) profileInfo.website = req.body.website;
  if (req.body.location) profileInfo.location = req.body.location;
  if (req.body.bio) profileInfo.bio = req.body.bio;
  if (req.body.status) profileInfo.status = req.body.status;
  if (req.body.githubusername) profileInfo.githubusername = req.body.githubusername;

  // Skills - split into array
  if (typeof req.body.skills !== undefined) {
    profileInfo.skills = req.body.skills.split(',');
  }

  // Social
  profileInfo.social = {};
  if (req.body.youtube) profileInfo.social.youtube = req.body.youtube;
  if (req.body.twitter) profileInfo.social.twitter = req.body.twitter;
  if (req.body.facebook) profileInfo.social.facebook = req.body.facebook;
  if (req.body.instagram) profileInfo.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileInfo.social.linkedin = req.body.linkedin;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileInfo },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create profile

        // Check if handle exists
        Profile.findOne({ handle: profileInfo.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              return res.status(400).json(errors);
            }

            // Save profile
            new Profile(profileInfo)
              .save()
              .then(profile => res.json(profile));
          });
      }
    });
});

// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
});

// @route  POST api/profile/education
// @desc   Add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
});

// @route  DELETE api/profile/experience/:id
// @desc   Delete experience from profile
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Get remove index
      const experiences = profile.experience.map(item => item.id);

      if (!experiences.includes(req.params.exp_id)) {
        errors.noexperience = 'The experience was not found for this profile';
        return res.status(404).json(errors);
      }

      const removeIndex = experiences.indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      profile.save().then(profile => res.json(profile));
  })
  .catch(err => res.status(404).json(err));
});

// @route  DELETE api/profile/education/:id
// @desc   Delete education from profile
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Get remove index
      const education = profile.education.map(item => item.id);

      if (!education.includes(req.params.edu_id)) {
        errors.noeducation = 'The education was not found for this profile';
        return res.status(404).json(errors);
      }

      const removeIndex = education.indexOf(req.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);

      profile.save().then(profile => res.json(profile));
  })
  .catch(err => res.status(404).json(err));
});

module.exports = router;
