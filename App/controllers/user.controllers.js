// user.controller.js
const userModel = require('../models/user.model');

useslist = async(req, res) => { // bắt buộc dùng async... await
    const userProfile = await userModel.getUsersProfile();
    res.send(userProfile);
    console.log(userProfile.Status);
};


module.exports = {
    useslist,
};