const Joi = require('joi');
const mongoose = require('mongoose');


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
    type: String,
    required: true,
    minlength: 4,
    maxlength: 25
  }
});


const User = mongoose.model('User', userSchema, 'User')

function validateUser(user) {
  const schema = {
    userName: Joi.string().min(3).max(40).required(),
    email: Joi.string().min(4).max(60).required(),
    tribe: Joi.string().min(4).max(25).required()
  }

  return Joi.validate(user, schema);
}


module.exports.User = User;
module.exports.validate = validateUser;
