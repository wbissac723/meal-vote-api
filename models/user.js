'use strict';

const Joi = require('joi');
const mongoose = require('mongoose');



const { tribeSchema } = require('./schemas/tribe.schema');
const { favoriteSpotSchema } = require('./schemas/favorite.schema')


const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 60,
    unique: true
  },
  tribe: {
    type:[tribeSchema],
    required: false,
    default: null
  },
  favoriteSpot: {
    type: [favoriteSpotSchema],
    required: false,
    default: null
  }
});



const User = mongoose.model('User', userSchema, 'User')

function validateUser(user) {
  const schema = {
    userName: Joi.string().min(3).max(40).required(),
    email: Joi.string().min(4).max(60).required(),
    tribe: Joi.array().optional(),
    favoriteSpot: Joi.array().optional()
  }

  return Joi.validate(user, schema);
}


module.exports.User = User;
module.exports.validate = validateUser;
