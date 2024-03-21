// user.controller.js
const loginModel = require('../models/login.model');
const { authenticate } = require('../Services/authentication');



login = async(req, res) => { // bắt buộc dùng async... await
    const login = await loginModel.login();
    res.send(login);
    console.log(login.Status);
};

//Xác thực login
loginAuthenticate  = async(req, res) => {
    const username = req.body.username
    const password = req.body.password
    const result = await authenticate(username, password);
    if (result.success) {
        res.json({ success: true, token: result.token });
    } else {
        res.status(401).json({ success: false, message: result.message });
    }
}



module.exports = {
    login,
    loginAuthenticate,
};