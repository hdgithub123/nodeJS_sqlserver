
const sqldata = require("../SQLServer/SqlServerConnect");
// lấy tất cả users trên csdl
function getUsersProfile() {
        // Logic để lấy thông tin người dùng từ cơ sở dữ liệu
        const Sqlstring = "Select * from users";
        const data =  sqldata.executeQuery(Sqlstring);
        return data;

}

module.exports = {
    getUsersProfile,
};
