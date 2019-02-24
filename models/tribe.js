const Joi = require('joi');
const mongoose = require('mongoose');


const tribeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tribeName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    tribeMember: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
        unique: true

    },
    tribeCreator: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
        unique: true

    }
});


const Tribe = mongoose.model('Tribe', tribeSchema, 'Tribe')

function validateTribe(tribe) {
    const schema = {
        tribeName: Joi.string().min(3).max(40).required(),
        tribeMember: Joi.string().min(3).max(40).required(),
        tribeCreator: Joi.string().min(3).max(40).required()
    }

    return Joi.validate(tribe, schema);
}


module.exports.Tribe = Tribe;
module.exports.validate = validateTribe;
