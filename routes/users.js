'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');


// Initialize the router
const router = express.Router();

const { User, validate } = require('../models/user');


// Add a new user to the database
router.post('/', (req, res) => {

  // Validate new user request body against userSchema
  const { error } = validate(req.body);

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
        message: 'Internal server error.', error: err
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

router.get('/profile', (req, res) => {

  User.find()
    .then((users) => {

      let userProfile = users.filter((user) => user.email === req.body.email);

      const user = _.pick(userProfile[0], ['userName', 'email', 'tribe', 'favoriteSpot']);

      res.status(200).send(user);

      console.log('Successful retrieved user ' + JSON.stringify(user, null, 2));
    })
    .catch((err) => {
      res.status(500).json({message: 'Internal server error occured.', error: err});

      console.log('Unable to find user. ' + err)
    });
});


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

      return res.status(500).json({
        message: 'Unable to create user.'
      })
    });
}


module.exports = router;
