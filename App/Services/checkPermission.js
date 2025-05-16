// const db = require("../config/MySql/executeQuery");

// const checkPermission = ({userId, rightId}) => {
//     return async (req, res, next) => {
//         try {
//             const result = await db.executeQuery(`
//                 SELECT rights.id FROM users
//                 JOIN users_roles ON users.id = users_roles.user_id
//                 JOIN roles ON users_roles.role_id = roles.id
//                 JOIN roles_rights ON roles.id = roles_rights.role_id
//                 JOIN rights ON roles_rights.right_id = rights.id
//                 WHERE users.id = ? AND rights.id = ?`, [userId, rightId]);


//             if (result.data && result.data.length > 0) {
//                 return next();

//             } else {
//                 return res.status(403).json({ message: "Người dùng không có quyền truy cập!" });
//             }
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ message: "Lỗi khi kiểm tra quyền!" });
//         }
//     };
// };

// module.exports = checkPermission;


const db = require("../config/MySql/executeQuery");

const checkPermission = ({ userId, rightIds }) => {
    return async (req, res, next) => {
        try {
            // Tạo danh sách quyền dưới dạng placeholders (?, ?, ?, ...) cho truy vấn SQL
            const placeholders = rightIds.map(() => '?').join(', ');

            const query = `
                SELECT rights.id FROM users
                JOIN users_roles ON users.id = users_roles.user_id
                JOIN roles ON users_roles.role_id = roles.id
                JOIN roles_rights ON roles.id = roles_rights.role_id
                JOIN rights ON roles_rights.right_id = rights.id
                WHERE users.id = ? AND rights.id IN (${placeholders})
            `;

            // Thực hiện truy vấn với danh sách quyền
            const result = await db.executeQuery(query, [userId, ...rightIds]);

            if (result.data && result.data.length > 0) {
                return next(); // Có ít nhất một quyền hợp lệ, tiếp tục request
            } else {
                return res.status(403).json({ message: "Người dùng không có quyền truy cập!" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Lỗi khi kiểm tra quyền!" });
        }
    };
};

module.exports = checkPermission;

