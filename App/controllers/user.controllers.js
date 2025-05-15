const sqldata = require("../config/SQLServer/SqlServerConnect");
const userModel = require("../models/user.model");


async function getUserByusername(req, res) {
    try {
        const username = req.params.username;
        const { data, status } = await userModel.getUserById(username);
        if (status && data.length > 0) {
            res.status(200).json({ status: status, data: data[0] });
        } else {
            res.status(404).json({ status: status, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}
async function getUsers(req, res) {
    try {
        const { data, status } = await userModel.getUsers();
        if (status) {
            res.status(200).json({ status: status, data: data });
        } else {
            res.status(500).json({ status: status, message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

async function insertUser(req, res) {
    try {
        const user = req.body;
        const { data, status } = await userModel.insertUser(user);
        if (status) {
            res.status(201).json({ status: status, data: data });
        } else {
            res.status(400).json({ status: status, message: data.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

async function insertUsers(req, res) {
    try {
        const users = req.body; // Lấy dữ liệu từ body của request
        await userModel.insertUsers(users); // Gọi hàm insertUsers từ model
        res.status(201).json({ status: true, message: 'Users inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const user = req.body;
        const { data, status } = await userModel.updateUser(userId, user);
        if (status) {
            res.status(200).json({ status: status, data: data });
        } else {
            res.status(400).json({ status: status, message: data.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}
async function updateUsers(req, res) {
    try {
        const users = req.body; // Lấy dữ liệu từ body của request
        await userModel.updateUsers(users); // Gọi hàm updateUsers từ model
        res.status(200).json({ status: true, message: 'Users updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}



async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const { data, status } = await userModel.deleteUser(userId);
        if (status) {
            res.status(204).json({ status: true, data: null });
        } else {
            res.status(400).json({ status: false, message: data.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}
async function deleteUsers(req, res) {
    try {
        const users = req.body; // Lấy dữ liệu từ body của request
        const { data, status } = await userModel.deleteUsers(users);
        if (status) {
            res.status(202).json({ status: true, data: data });
        } else {
            res.status(400).json({ status: false, message: data.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    getUserByusername,
    getUsers,
    insertUser,
    insertUsers,
    updateUser,
    updateUsers,
    deleteUser,
    deleteUsers
};