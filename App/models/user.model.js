
const sqldata = require("../SQLServer/SqlServerConnect");
// lấy tất cả users trên csdl
function getUsers() {
        // Logic để lấy thông tin người dùng từ cơ sở dữ liệu
        const Sqlstring = "Select * from users";
        const data =  sqldata.executeQuery(Sqlstring);
        return data;

}
async function getUserById(userId) {
    const sqlQuery = "SELECT * FROM Users WHERE Id = ?";
    return await sqldata.executeQuery(sqlQuery, userId);
}
async function createUser(user) {
    const { id, username, password, fullName, phone, address, email } = user;

    // Mã hóa mật khẩu bằng bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = "INSERT INTO Users (id, username, password, fullName, phone, address, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return await sqldata.executeQuery(sqlQuery, id, username, hashedPassword, fullName, phone, address, email);
}

async function createUsers(users) {
    const placeholders = users.map(() => '(?, ?)').join(',');
    const values = users.flatMap(user => [user.username, user.password]);
    const sqlQuery = `INSERT INTO Users (username, password) VALUES ${placeholders}`;
    await sqldata.executeQuery(sqlQuery, ...values);
}

async function updateUser(userId, user) {
    const { username, password, fullName, phone, address, email } = user;

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
    return await sqldata.executeQuery(sqlQuery, ...params);
}

async function updateUsers(users) {
    let sqlQuery = 'BEGIN TRANSACTION; ';
    users.forEach(user => {
        sqlQuery += `UPDATE Users SET username = '${user.username}', password = '${user.password}' WHERE id = ${user.id}; `;
    });
    sqlQuery += 'COMMIT;';
    await sqldata.executeQuery(sqlQuery);
}

async function deleteUser(userId) {
    const sqlQuery = "DELETE FROM Users WHERE Id = ?";
    return await sqldata.executeQuery(sqlQuery, userId);
}

async function deleteUsers(users) {
    let sqlQuery = 'BEGIN TRANSACTION; ';
    users.forEach(user => {
        sqlQuery += `DELETE FROM Users WHERE id = ${user.id}; `;
    });
    sqlQuery += 'COMMIT;';
    await sqldata.executeQuery(sqlQuery);
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

