'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');


// Initialize the router
const router = express.Router();

const {
  User,
  validate
} = require('../models/user');


// Add a new user to the database
router.post('/', (req, res) => {

  // Validate new user request body against userSchema
  const {
    error
  } = validate(req.body);

  // Request does not match userSchema
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  let user;

  // Verify user does not already exist by checking email
  user = User.findOne({
      email: req.body.email
    })
    .then((account) => {

      // Return bad request if user already exists
      if (account) {

        const userDetails = _.pick(user, ['userName', 'email']);

        // Generate JWT
        const token = jwt.sign(userDetails, process.env.JWT_KEY);


        return res.send({
          code: 204,
          message: 'Existing user login success.',
          token: token
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'Internal server error.',
        error: err
      });
    });


  // Create a new user from the request body properties
  user = new User({
    _id: new mongoose.Types.ObjectId(),
    userName: req.body.userName,
    email: req.body.email,
    tribe: req.body.tribe,
    favoriteSpot: req.body.favoriteSpot
  });


  // Store user in the database
  saveUser(user, res);
});

router.post('/profile', (req, res) => {

  User.find()
    .then((users) => {

      // Return 404 when user profile doesn't exist
      // if (users && !users.userName) {
      //   return res.status(404).json({message: 'User not found.'});
      // }

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
  User.findOne({email: req.body.email})
    .then((user) => {
      updateUserProfile(user, req, res);
    })
    .catch((err) => {
      return res.status(500).json({message: err});
    });
});

function updateUserProfile(user, req, res) {

  // Push the tribe into the User profile
  user.update({$push: {tribe: req.body.tribeName}})

    .then((data) => {
      return res.status(201).json({
        message: "Successfully updated profile.",
        updatedUser: data
      })
    })
    .catch((err) => {
      console.log('Unable to update user profile.' + err);
      return res.status(500).json({message: 'Interal server error occurred.'});
    });

}


function saveUser(user, res) {
  user.save()
    .then(() => {
      console.log(`Successfully created user ${user.userName}.`)

      const userDetails = _.pick(user, ['userName', 'email']);

      // Generate JWT
      const token = jwt.sign(userDetails, process.env.JWT_KEY);


      return res.status(201).json({
        code: 201,
        message: 'Account created success.',
        token: token
      });
    })
    .catch((err) => {
      console.log('Failed to create user: ' + err);
      return res.status(500).json({message: 'Interal server error occurred.'})
    });
}


module.exports = router;
