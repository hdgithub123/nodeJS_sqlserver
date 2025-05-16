const express = require('express');
const router = express.Router();
const { refreshToken } = require('../Services/refreshToken');

router.post('/refresh-token', refreshToken);

module.exports = router;