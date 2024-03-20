// app.js
const express = require('express');
const app = express();
//require('dotenv').config();
require('dotenv').config();

// Import router
const homeRoutes = require('./routes/home.routes');
const profileRoutes = require('./routes/profile.routes');
const userRoutes = require('./routes/user.routes');

// Sử dụng router
app.use('/', homeRoutes);

// Sử dụng router profileRoutes cho các định tuyến liên quan đến trang profile
app.use('/profile', profileRoutes);

// Sử dụng router userRoutes cho các định tuyến liên quan đến trang user
app.use('/user', userRoutes);

// Khởi động máy chủ
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
