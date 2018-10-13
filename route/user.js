const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {User, validateUser} = require('../model/users');
const bcrypt = require('bcrypt');

router.get('/user/user-info', auth, async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User
        .findOne({$or: [{itsc: req.user.itsc}, {userID: req.user.userID}]})
        .select({name: 1, quota: 1})
        .select('-password');

    if (!user) return res.status(404).send('User not found');

    req.send(user);
});

router.post('/user', async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await new User ({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        itsc: req.body.itsc,
        userID: req.body.userID,
        telephone: req.body.telephone,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(user);
});

router.put('/user', auth, async (req, res) => {
    const {error} = validateUserUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if(!(req.user.itsc && req.user.userID)) return res.status(400).send('Please provide either User ID or ITSC');

    let updateContent = {};
    for(let field in req.body) {
        if (req.body[field]) updateContent[field] = req.body[field];
    }

    let user = await User
        .findOneAndUpdate({$or: [{itsc: req.user.itsc}, {userID: req.user.userID}]}, updateContent, {new: true});
    
    if (!user) return res.status(404).send('User not found');

    res.send(user);
});
