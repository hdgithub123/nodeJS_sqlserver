const bcrypt = require('bcrypt');
const sqldata = require("../SQLServer/SqlServerConnect");
// lấy tất cả users trên csdl

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
async function deleteUser(userId) {
    const sqlQuery = "DELETE FROM Users WHERE Id = ?";
    return await sqldata.executeQuery(sqlQuery, userId);
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
async function getUsers() {
    // Logic để lấy thông tin người dùng từ cơ sở dữ liệu
    const Sqlstring = "Select * from users";
    const data = await sqldata.executeQuery(Sqlstring);
    return data;

}
async function createUsers(users) {
    const placeholders = users.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(',');
    const values = users.flatMap(user => [user.id, user.username, user.password, user.fullName, user.phone, user.address, user.email]);
    const sqlQuery = `INSERT INTO Users (id, username, password, fullName, phone, address, email) VALUES ${placeholders}`;
    console.log(sqlQuery);
    await sqldata.executeQuery(sqlQuery, ...values);
}

async function updateUsers(users) {
    console.log("Dang vao update")
    let sqlQuery = 'BEGIN TRANSACTION; ';
    users.forEach(user => {
        // Chuyển đổi giá trị id từ chuỗi sang số nguyên
        const userId = parseInt(user.id);
        // Kiểm tra xem giá trị id có hợp lệ không
        if (!isNaN(userId)) {
            // Mã hóa mật khẩu mới nếu có
            if (user.password) {
                const hashedPassword = bcrypt.hashSync(user.password, 10); // Mã hóa mật khẩu với bcrypt
                sqlQuery += `UPDATE Users SET username = ?, password = '${hashedPassword}', fullName = ?, phone = ?, address = ?, email = ? WHERE id = ${userId}; `;
            } else {
                sqlQuery += `UPDATE Users SET username = ?, fullName = ?, phone = ?, address = ?, email = ? WHERE id = ${userId}; `;
            }
        }
    });
    sqlQuery += 'COMMIT;';
    console.log(sqlQuery)
    const values = users.flatMap(user => [user.username, user.fullName, user.phone, user.address, user.email]);
    await sqldata.executeQuery(sqlQuery, ...values);
}

// async function updateUsers(users) {
//     let sqlQuery = 'BEGIN TRANSACTION; ';
//     for (const user of users) {
//         // Mã hóa mật khẩu mới nếu có
//         if (user.password) {
//             const hashedPassword = await bcrypt.hash(user.password, 10); // Mã hóa mật khẩu với bcrypt
//             sqlQuery += `UPDATE Users SET username = ?, password = ?, fullName = ?, phone = ?, address = ?, email = ? WHERE id = ?; `;
//             const values = [user.username, hashedPassword, user.fullName, user.phone, user.address, user.email, user.id];
//             console.log("1",sqlQuery)
//             await sqldata.executeQuery(sqlQuery, ...values);
//         } else {
//             sqlQuery += `UPDATE Users SET username = ?, fullName = ?, phone = ?, address = ?, email = ? WHERE id = ?; `;
//             const values = [user.username, user.fullName, user.phone, user.address, user.email, user.id];
//             await sqldata.executeQuery(sqlQuery, ...values);
//         }
//         console.log("2",sqlQuery)
//     }
//     sqlQuery += 'COMMIT;';
// }

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
    createUser,  
    updateUser,
    deleteUser,
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers
};

