const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema} = require('./users');

const userRecordSchema = new mongoose.Schema({
    itsc: {
        type: userSchema,
        ref: 'User',
        lowercase: True,
        required: True,
        min: 5,
        max: 10
    },
    userID: {
        type: userSchema,
        ref: 'User',
        required: True,
        min: 8,
        max: 10
    }, 
    dateBorrowed: {
        type: Date
    },
    dateReturned: {
        type: Date
    }
});

let UserRecord = mongoose.model('UserRecord', userRecordSchema);

module.exports = function validateUserRecord(user) {
    const schema = {
        itsc: Joi.string().required().min(5).max(10),
        userID: Joi.string().required().min(8).max(10),
        dateBorrowed: Joi.date(),
        dateReturned: Joi.date(),
    };

    return Joi.validate(userRecord, schema)
}

module.exports.UserRecord = UserRecord;
