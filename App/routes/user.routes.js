// home.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
// Định tuyến GET cho trang chủ user

router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.get('/',userController.getUsers);
router.post('/more', userController.createUsers);
router.put('/more', userController.updateUsers);
router.delete('/more', userController.deleteUsers);

module.exports = router;
