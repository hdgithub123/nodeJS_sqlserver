// home.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../Services/authorization');
const loginController = require('../controllers/login.controllers');
// Định tuyến GET cho trang chủ login
router.get('/',authMiddleware ,loginController.login);

router.post('/authenticate', loginController.loginAuthenticate);



module.exports = router;
