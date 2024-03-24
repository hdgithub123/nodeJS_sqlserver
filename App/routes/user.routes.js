// home.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
// Định tuyến GET cho trang chủ user



router.get('/list',userController.getUsers);
router.post('/list', userController.createUsers);
router.put('/list', userController.updateUsers);
router.delete('/list', userController.deleteUsers);

//chú ý route cha phải được đặt sau route con
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
