const Joi = require('joi');
const mongoose = require('mongoose');


const membersSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 40,
      unique: false
    }
  });


  module.exports.membersSchema = membersSchema;
