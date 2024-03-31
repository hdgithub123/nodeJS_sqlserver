// app.js
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// bổ sung để dữ liệu từ bên ngoài có thể nhận được
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


// Import router
const homeRoutes = require('./routes/home.routes');
const profileRoutes = require('./routes/profile.routes');
const userRoutes = require('./routes/user.routes');
const loginRoutes = require('./routes/Login.routes');
const authMiddleware = require('./Services/authorization');


// Danh sách các đường dẫn không áp dụng middleware auth vd const protectedRoutes = ['/home', '/user/list', '/login'];
const protectedRoutes = ['/home', '/user', '/login'];

app.use((req, res, next) => {
    // Kiểm tra xem nếu đường dẫn của yêu cầu thuộc danh sách các trang không cần bảo vệ hoặc là một phần của chúng
    if (!protectedRoutes.some(route => req.path.startsWith(route))) {
        return authMiddleware(req, res, next); // Nếu là một trong các trang không cần bảo vệ, gọi middleware auth
    }

    next(); // Cho phép yêu cầu tiếp theo mà không cần xác thực
});

// Sử dụng router
app.use('/', homeRoutes);

// Sử dụng router profileRoutes cho các định tuyến liên quan đến trang profile
app.use('/profile', profileRoutes);

// Sử dụng router userRoutes cho các định tuyến liên quan đến trang user
app.use('/user', userRoutes);

// Sử dụng router userRoutes cho các định tuyến liên quan đến trang user
app.use('/login', loginRoutes);

// Khởi động máy chủ
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
