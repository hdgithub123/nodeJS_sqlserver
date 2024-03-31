const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sqldata = require("../SQLServer/SqlServerConnect");

require('dotenv').config(); // Load biến môi trường từ tệp .env

const secretKey = process.env.SECRET_KEY;

async function authenticate(username, password) {
    const Sqlstring = "Select username, password from users where username = ?";
    const users = await sqldata.executeQuery(Sqlstring,username);
    if (users.Status) {
        const user = users.Result.find(u => u.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
       // if (user && password === user.password) {// su dung tam
            // Tạo và trả về token nếu xác thực thành công
            const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
            return { success: true, token: token };
        } else{
            return { success: false, message: 'Invalid username or password' };
        }
    }else{
        return { success: false, message: 'ERROR connect' };
    }
}

module.exports = { authenticate };
