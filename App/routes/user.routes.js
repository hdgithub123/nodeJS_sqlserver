// home.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
// Định tuyến GET cho trang chủ user
router.get('/',userController.useslist);

module.exports = router;
