// profile.routes.js
const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controllers');
// Định tuyến GET cho trang profile
router.get('/', profileController.profile);

// Định tuyến GET cho trang chỉnh sửa profile
router.get('/edit',profileController.profileEdit);

module.exports = router;

