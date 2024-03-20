// user.controller.js
const userModel = require('../models/user.model');



useslist = (req, res) => {
    const userProfile = userModel.getUsersProfile();
    res.send(userProfile);
};


module.exports = {
    useslist,
};