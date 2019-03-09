'use strict';
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose');

const { User, validate } = require('../../models/user')

function removeIdProperty(user) {
  // Makes sure id property isnt part of the object
  const tribes = [];
  const members = [];
  user.tribe.forEach(tribe => {

    tribe.members.forEach(member => {

      members.push(_.pick(member, ['name']));

      console.log('tribe members' + JSON.stringify(members, null, 2));

    });


    tribes.push(_.pick(tribe, ['creator', 'members', 'name']));
  });


  const response = {
    "userName": user.userName,
    "email": user.email,
    "tribe": tribes
  }

  return response;
}


function locateUser(req, res, user) {
    // Verify user does not already exist by checking email
  user = User.findOne({email: req.body.email})
    .then((account) => {
        // Return JWT token for registered user
        if (account) {
        // Get userName and email values from User
        const userDetails = _.pick(user, ['userName', 'email']);

        // Generate JWT with userName and email
        const token = jwt.sign(userDetails, process.env.JWT_KEY);

        // Send response to the client
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
}

function validateRequest(req, res) {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
      }
      return;
}

function saveUser(user, res) {
    user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: req.body.userName,
        email: req.body.email,
        tribe: req.body.tribe,
        favoriteSpot: req.body.favoriteSpot
      });


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

module.exports.locateUser = locateUser;
module.exports.validateRequest = validateRequest;
module.exports.saveUser = saveUser;
module.exports.removeIdProperty = removeIdProperty;
