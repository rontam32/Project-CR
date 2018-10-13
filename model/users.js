const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: True,
        min: 10,
        max: 30
    },
    lastname: {
        type: String,
        required: True,
        min: 10,
        max: 30
    },
    itsc: {
        type: String,
        lowercase: True,
        required: True,
        min: 5,
        max: 10
    },
    userID: {
        type: String,
        required: True,
        min: 8,
        max: 10
    },
    quota: {
        type: Number,
        default: 2,
        min: 0,
        max: 2

    },
    telephone: {
        type: String,
        required: true,
        min: 8,
        max: 15
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 50
    }


});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({itsc: this.itsc, userID: this.userID}, config.get('jwtPrivateKey'));
    return token;
}

let User = mongoose.model('User', userSchema);

module.exports = function validateUser(user) {
    const schema = {
        firstname: Joi.string().required().min(10).max(30),
        lastname: Joi.string().required().min(10).max(30),
        itsc: Joi.string().required().min(5).max(10),
        userID: Joi.string().required().min(8).max(10),
        quota: Joi.string().min(0).max(2),
        dateBorrowed: Joi.date(),
        dateReturned: Joi.date(),
        telephone: Joi.string().required().min(8).max(15),
        password: Joi.string().min(8).max(50).required()
    };

    return Joi.validate(user, schema)
}

module.exports = function validateUserUpdate(user) {
    const schema = {
        firstname: Joi.string().min(10).max(30),
        lastname: Joi.string().min(10).max(30),
        itsc: Joi.string().min(5).max(10),
        userID: Joi.string().min(8).max(10),
        quota: Joi.string().min(0).max(2),
        dateBorrowed: Joi.date(),
        dateReturned: Joi.date(),
        telephone: Joi.string().min(8).max(15)
    };

    return Joi.validate(user, schema)
}

module.exports.User = User;
