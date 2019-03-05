'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router();
const {
  User,
  validate
} = require('../models/user');

// Stores a new user in the database
router.post('/', async (req, res) => {
  // Validate new user request body against userSchema
  const {
    error
  } = validate(req.body);

  // Request does not match userSchema
  if (error) return res.status(400).json({
    message: error.details[0].message
  });

  // Verify user does not already exist by checking email
  let user = await User.findOne({email: req.body.email})
  try {
    if (user && user.email) {
      // Account already exists
      return res.status(400).json({message: 'Account already exists'});
    }

  } catch (ex) {
    return res.status(500).json({message: ex});
  }

  user = new User({
    _id: new mongoose.Types.ObjectId(),
    userName: req.body.userName,
    email: req.body.email,
    tribe: req.body.tribe,
    favoriteSpot: req.body.favoriteSpot
  });

  await user.save()
    try {
      console.log(`Successfully created user ${user.userName}.`);

      const userProfile = _.pick(user, ['userName', 'email', 'tribe', 'favoriteSpot']);
      // Generate JWT
      const token = jwt.sign(userProfile, process.env.JWT_KEY);

      return res.status(201).json({
        user: userProfile,
        message: 'Account created success.',
        token: token
      });

  } catch (ex) {
    console.log('Failed to create user: ' + ex);
    return res.status(500).json({message: ex});
  }
});


router.post('/profile', (req, res) => {

  User.find()
    .then((users) => {

      let userProfile = users.filter((user) => user.email === req.body.email);

      const user = _.pick(userProfile[0], ['userName', 'email', 'tribe', 'favoriteSpot']);

      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Internal server error occurred.',
        error: err
      });

      console.log('Unable to find user. ' + err)
    });
});

router.patch('/', (req, res) => {

  // Find user in database by email
  User.findOne({
      email: req.body.email
    })
    .then((user) => {
      updateUserProfile(user, req, res);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err
      });
    });
});

function updateUserProfile(user, req, res) {

  // Push the tribe into the User profile
  user.update({
      $push: {
        tribe: req.body.tribeName
      }
    })

    .then((data) => {
      return res.status(201).json({
        message: "Successfully updated profile.",
        updatedUser: data
      })
    })
    .catch((err) => {
      console.log('Unable to update user profile.' + err);
      return res.status(500).json({
        message: 'Interal server error occurred.'
      });
    });

}

function saveUser(user, res) {


}


module.exports = router;
