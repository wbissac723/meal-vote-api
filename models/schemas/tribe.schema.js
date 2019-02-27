'use strict';

const { membersSchema } = require('./members.schema')


const mongoose = require('mongoose');


const tribeSchema = mongoose.Schema({
  creator: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40
  },
  members: {
    type: [membersSchema],
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40
  }
});



module.exports.tribeSchema = tribeSchema;
