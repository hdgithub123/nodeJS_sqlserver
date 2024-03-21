const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config(); // Load biến môi trường từ tệp .env

const secretKey = process.env.SECRET_KEY;

async function authenticate(username, password) {

    const Sqlstring = "Select * from users where username = ?";
    const users = await sqldata.executeQuery(Sqlstring,username);
    // xu ly du lieu
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        // Tạo và trả về token nếu xác thực thành công
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        return { success: true, token: token };
    }
    return { success: false, message: 'Invalid username or password' };
}

module.exports = { authenticate };
