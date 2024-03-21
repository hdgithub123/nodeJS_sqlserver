const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load biến môi trường từ tệp .env

const secretKey = process.env.SECRET_KEY;

// Middleware để xác thực token JWT và phân quyền người dùng
function authMiddleware(req, res, next) {
    // Lấy token từ tiêu đề 'Authorization'
    const token = req.headers['Authorization'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
    }

    // Xác thực token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        } else {
            // Lưu thông tin người dùng được giải mã từ token vào đối tượng yêu cầu
            req.user = decoded;
            next(); // Cho phép middleware tiếp tục xử lý yêu cầu
        }
    });
}

module.exports = authMiddleware;
