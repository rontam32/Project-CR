const express = require('express');
const bcrypt = require('bcrypt');
const {User} = require('../model/users');
const router = express.Router();
const Joi = require('joi');

router.post('/', (req, res) => {
    const {error} = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({itsc: req.body.itsc});
    if(!user ) return res.status(400).send('Invalid login');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!user ) return res.status(400).send('Invalid login');

    const token = user.generateAuthToken();

    res.send(token);
});

function validateLogin(req) {
    const schema = {
        itsc: Joi.string().min(5).max(10),
        password: Joi.string().min(8).max(50).required()
    };

    return Joi.validate(user, schema)
}
