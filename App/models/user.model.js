const bcrypt = require('bcrypt');
const sqldata = require("../SQLServer/SqlServerConnect");
// lấy tất cả users trên csdl

async function getUserById(userId) {
    const sqlQuery = "SELECT * FROM Users WHERE Id = ?";
    return await sqldata.executeQuery(sqlQuery, userId);
}
async function getUsers() {
    // Logic để lấy thông tin người dùng từ cơ sở dữ liệu
    const Sqlstring = "Select * from users";
    const data = await sqldata.executeQuery(Sqlstring);
    return data;

}

/**
 * Inserts a user into the database.
 * @param {Object} user - An object representing the user to be inserted.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the insertion operation.
 */
async function insertUser(user) {
    const { id, username, password, fullName, phone, address, email } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const reuser = { id, username, password: hashedPassword, fullName, phone, address, email }
    return await sqldata.insertObject("Users", reuser);
}

/**
 * Updates user information in the database based on the provided userId.
 * @param {Object} userId - An object representing the column name and its corresponding value to identify the user.
 * @param {Object} user - An object containing the updated user information.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the update operation.
 */
async function updateUser(userId, user) {
    const { username, password, fullName, phone, address, email } = user;
    let hashedPassword = null;
    if (password) hashedPassword = await bcrypt.hash(password, 10);
    const userData = { username, password: hashedPassword, fullName, phone, address, email };
    const columKey = { id: userId }; // Use userId as the columKey
    return await sqldata.updateObject("Users", userData, columKey);
}

/**
 * Deletes a user from the database.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the deletion operation.
 */
async function deleteUser(userId) {
    return await sqldata.deleteObject("Users", { id: userId });
}

/**
 * Inserts multiple users into the database.
 * @param {Array<Object>} users - An array of objects representing the users to be inserted.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the insertion operation.
 */
async function insertUsers(users) {
    try {
        const hashedUsers = await Promise.all(users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        }));
        return await sqldata.insertObjects("Users", hashedUsers);
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error inserting users" };
    }
}

/**
 * Updates information of multiple users in the database.
 * @param {Array<Object>} users - An array of objects representing the updated user information.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the update operation.
 */
async function updateUsers(users) {
    try {
        const hashedUsers = await Promise.all(users.map(async user => {
            if (user.password) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            }
            return user;
        }));
        // Cập nhật người dùng trong cơ sở dữ liệu
        return await sqldata.updateObjects("Users", hashedUsers, ["id"]);
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error updating users" };
    }
}






/**
 * Deletes multiple users from the database.
 * @param {Array<number>} userIds - An array of user IDs to be deleted.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the deletion operation.
 */
async function deleteUsers(userIds) {
    return await sqldata.deleteObjects("Users",userIds)
}

module.exports = {
    getUserById,  
    insertUser,  
    updateUser,
    deleteUser,
    getUsers,
    insertUsers,
    updateUsers,
    deleteUsers
};

