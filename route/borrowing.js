const express = require('express');
const auth = require('../middleware/auth');
const express = require('express');
const {User} = require('../model/users');
const {UserRecord, validateUserRecord} = require('../model/userRecord');
const moment = require('moment');
const router = express.Router();

router.put('/borrow', auth, async (req, res) => {
    const {error} = validateUserRecord(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if(!(req.user.itsc && req.user.userID)) return res.status(400).send('Please enter valid User ID or ITSC');

    let user = await User
        .find({$or: [{itsc: req.body.itsc}, {userID: req.body.userID}]}) 
    
    if (!user) return res.status(404).send('User not yet registered');

    if (user.quota === 0) return res.send('User has no quota to borrow');
    user = await User.update({$inc: {quota: -1}}, {new: true});

    let {itsc, userID} = user;

    let userRecord = await new UserRecord ({
        itsc,
        userID,
        dateBorrowed: new moment(new Date()).format("DD/MM/YYYY")
    });

    userRecord = await userRecord.save();

    res.send(userRecord);
});
