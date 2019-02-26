'use strict';

const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');


// Initialize the router
const router = express.Router();

const { Tribe, validate } = require('../models/tribe');


// Get all tribes 
router.get('/', (req, res) => {

  Tribe.find()
    .then((data) => {
      console.log('Successfully retrieved all tribes.');

      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log('Error occured ' + err);

      return res.status(500).json({message: "Internal server error occured."})
    });
});


// Add a new user to the database
router.post('/', (req, res) => {

  // Validate new user request body against userSchema
  const { error } = validate(req.body);

  // Request does not match userSchema
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  let tribe;

  // Verify user does not already exist by checking email
  tribe = Tribe.findOne({tribeName: req.body.tribeName})
    .then((group) => {

      // Return bad request if user already exists
      if (group) {
        return res.status(400).json({message: 'Tribe already exists.'})

      }
    })
    .catch((err) => {
      return res.status(500).json({message: 'Internal server error.'});
    });


  // Create a new user from the request body properties
  tribe = new Tribe({
    _id: new mongoose.Types.ObjectId(),
    tribeName: req.body.tribeName,
    tribeCreator: req.body.tribeCreator,
    tribeMember: req.body.tribeMember
  });


  // Store user in the database
  saveTribe(tribe, res);
});


function saveTribe(tribe, res) {
  tribe.save()
    .then(() => {
      console.log(`Successfully tribe ${tribe.tribeName}.`)

      const tribeDetails = _.pick(tribe, ['tribeName', 'tribeCreator', 'tribeMember']);


      return res.status(201).json({tribe: tribeDetails});
    })
    .catch((err) => {
      console.log('Failed to create tribe: ' + err);

      return res.status(500).json({message: 'Internal server error occurred.'})
    });
}


module.exports = router;
