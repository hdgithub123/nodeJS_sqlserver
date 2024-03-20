// home.routes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controllers');
// Định tuyến GET cho trang chủ
router.get('/',homeController.homePage);

// Định tuyến GET cho trang giới thiệu
router.get('/about', homeController.homeAbout);
module.exports = router;
