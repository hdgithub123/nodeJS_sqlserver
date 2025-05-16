const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sqldata = require("../config/SQLServer/SqlServerConnect");

require('dotenv').config(); // Load biến môi trường từ tệp .env

const secretKey = process.env.SECRET_KEY;

async function authenticate(username, password) {
    const Sqlstring = "Select username, password from users where username = ?";
    const users = await sqldata.executeQuery(Sqlstring, [username]);
    if (users.status) {
        const user = users.data.find(u => u.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
            // Tạo và trả về token nếu xác thực thành công
            const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: '7d' });
            return { status: true, token: token, refreshToken: refreshToken };
        } else {
            return { status: false, token: null, refreshToken: null, message: 'Invalid username or password' };
        }
    } else {
        return { status: false, message: 'ERROR connect' };
    }
}
module.exports = { authenticate };
