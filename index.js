const express = require('express');
const winston = require('winston');
const config = require('config');
app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
const borrowing = require('./route/borrowing');
const returning = require('./route/returning');
const user = require('./route/user');

app.use('/borrow', borrowing);
app.use('/return', returning);
app.use('/user', user);
app.use('/user/user-info', user);

if (!config.get('jwtPrivateKey')) {
    console.error('jwtPrivateKey is not defined');
    process.exit(1);
}




module.exports = function(app) {
    app.use(express.json());
}

const port = process.env.PORT || 8888;
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;
