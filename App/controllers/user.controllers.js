// user.controller.js
//const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const sqldata = require("../SQLServer/SqlServerConnect");

// Hàm lấy danh sách tất cả người dùng
async function usersList(req, res) {
    const sqlQuery = "SELECT * FROM Users";
    const { Result, Status } = await sqldata.executeQuery(sqlQuery);
    if (Status) {
        res.status(200).json({ success: true, data: Result });
    } else {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Hàm tạo mới người dùng
async function createUser(req, res) {
    const { id, username, password, fullName, phone, address, email } = req.body;
    
    // Mã hóa mật khẩu bằng bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = "INSERT INTO Users (id, username, password, fullName, phone, address, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const { Result, Status } = await sqldata.executeQuery(sqlQuery, id, username, hashedPassword, fullName, phone, address, email);
    if (Status) {
        res.status(201).json({ success: true, data: Result });
    } else {
        res.status(400).json({ success: false, message: Result.message });
    }
}

// Hàm lấy thông tin người dùng theo ID
async function getUserById(req, res) {
    const userId = req.params.id;
    const sqlQuery = "SELECT * FROM Users WHERE Id = ?";
    const { Result, Status } = await sqldata.executeQuery(sqlQuery, userId);
    if (Status && Result.length > 0) {
        res.status(200).json({ success: true, data: Result[0] });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
}

// Hàm cập nhật thông tin người dùng
async function updateUser(req, res) {
    const userId = req.params.id;
    const { username, password, fullName, phone, address, email } = req.body;

    // Kiểm tra xem người dùng đã cung cấp mật khẩu mới hay không
    let hashedPassword = null;
    if (password) {
        // Nếu có mật khẩu mới, mã hóa mật khẩu mới
        hashedPassword = await bcrypt.hash(password, 10);
    }

    // Tạo câu truy vấn cập nhật dựa trên việc có mật khẩu mới hay không
    let sqlQuery;
    let params;
    if (hashedPassword) {
        sqlQuery = "UPDATE Users SET Username = ?, Password = ?, FullName = ?, Phone = ?, Address = ?, Email = ? WHERE Id = ?";
        params = [username, hashedPassword, fullName, phone, address, email, userId];
    } else {
        sqlQuery = "UPDATE Users SET Username = ?, FullName = ?, Phone = ?, Address = ?, Email = ? WHERE Id = ?";
        params = [username, fullName, phone, address, email, userId];
    }

    // Thực hiện truy vấn cập nhật trong cơ sở dữ liệu
    const { Result, Status } = await sqldata.executeQuery(sqlQuery, ...params);
    if (Status) {
        res.status(200).json({ success: true, data: Result });
    } else {
        res.status(400).json({ success: false, message: Result.message });
    }
}

// Hàm xóa người dùng
async function deleteUser(req, res) {
    const userId = req.params.id;
    const sqlQuery = "DELETE FROM Users WHERE Id = ?";
    const { Result, Status } = await sqldata.executeQuery(sqlQuery, userId);
    if (Status) {
        res.status(204).json({ success: true, data: null });
    } else {
        res.status(400).json({ success: false, message: Result.message });
    }
}

module.exports = {
    usersList,
    createUser,
    getUserById,
    updateUser,
    deleteUser
};