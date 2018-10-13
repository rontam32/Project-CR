const express = require('express');
const auth = require('../middleware/auth');
const express = require('express');
const moment = require('moment');
const {User} = require('../model/users');
const {UserRecord, validateUserRecord} = require('../model/userRecord');
const router = express.Router();

router.put('/return', auth, async (req, res) => {
    const {error} = validateUserRecord(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if(!(req.user.itsc && req.user.userID)) return res.status(400).send('Please enter valid User ID and ITSC');

    let user = await User
        .find({$or: [{itsc: req.body.itsc}, {userID: req.body.userID}]}) 
    
    if (!user) return res.status(404).send('User has not registered');

    let userRecord = await UserRecord
        .findOneAndUpdate({$or: [{itsc: req.body.itsc}, {userID: req.body.userID}]}, 
            {dateReturned: new moment(new Date()).format("DD/MM/YYYY")}, {new: true}); 
    
    if (!userRecord) return res.status(404).send('User has no borrowing record');

    user = await User.update({$inc: {quota: 1}}, {new: true});

    let {dateReturned, dateBorrowed} = userRecord;
    const borrowDuration = moment.duration(dateReturned.diff(dateBorrowed)).asDays;

    if (borrowDuration > 3) res.send(`You are required to hand in overdue deposit of HKD ${borrowDuration * 10}`);
    
});