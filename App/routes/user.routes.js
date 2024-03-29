// home.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
// Định tuyến cho trang user

router.get('/list',userController.getUsers);
router.post('/list', userController.insertUsers);
router.put('/list', userController.updateUsers);
router.delete('/list', userController.deleteUsers);

//chú ý route cha phải được đặt sau route con
router.get('/detail/:username', userController.getUserByusername);
router.post('/detail/', userController.insertUser);
router.put('/detail/:id', userController.updateUser);
router.delete('/detail/:id', userController.deleteUser);

module.exports = router;
