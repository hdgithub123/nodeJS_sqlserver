// home.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
// Định tuyến GET cho trang chủ user
router.get('/',userController.usersList);

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
