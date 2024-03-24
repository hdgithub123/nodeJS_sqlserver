const sqldata = require("../SQLServer/SqlServerConnect");
const userModel = require("../models/user.model");


async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const { Result, Status } = await userModel.getUserById(userId);
        if (Status && Result.length > 0) {
            res.status(200).json({ success: true, data: Result[0] });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
async function getUsers(req, res) {
    try {
        const { Result, Status } = await userModel.getUsers();
        if (Status) {
            res.status(200).json({ success: true, data: Result });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function createUser(req, res) {
    try {
        const user = req.body;
        const { Result, Status } = await userModel.createUser(user);
        if (Status) {
            res.status(201).json({ success: true, data: Result });
        } else {
            res.status(400).json({ success: false, message: Result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function createUsers(req, res) {
    try {
        const users = req.body; // Lấy dữ liệu từ body của request
        await userModel.createUsers(users); // Gọi hàm insertUsers từ model
        res.status(201).json({ success: true, message: 'Users inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const user = req.body;
        const { Result, Status } = await userModel.updateUser(userId, user);
        if (Status) {
            res.status(200).json({ success: true, data: Result });
        } else {
            res.status(400).json({ success: false, message: Result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
async function updateUsers(req, res) {
    try {
        const users = req.body; // Lấy dữ liệu từ body của request
        await userModel.updateUsers(users); // Gọi hàm updateUsers từ model
        console.log(users)
        res.status(200).json({ success: true, message: 'Users updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const { Result, Status } = await userModel.deleteUser(userId);
        if (Status) {
            res.status(204).json({ success: true, data: null });
        } else {
            res.status(400).json({ success: false, message: Result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
async function deleteUsers(req, res) {
    try {
        const users = req.body; // Lấy dữ liệu từ body của request
        await userModel.deleteUsers(users); // Gọi hàm deleteUsers từ model
        res.status(204).json({ success: true, message: 'Users deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    getUserById,
    getUsers,
    createUser,
    createUsers,
    updateUser,
    updateUsers,
    deleteUser,
    deleteUsers
};