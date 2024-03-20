const { executeQuery } = require("../../SQLServer/SqlServerConnect")

// user.model.js
getUsersProfile = () => {
    // Logic để lấy thông tin người dùng từ cơ sở dữ liệu
    Sqlstring = "Select * from users"
    
    // lấy dữ liệu từ DB
    executeQuery(Sqlstring)
    .then(response => {
        // Truy cập vào kết quả và thông báo từ Promise
            console.log(response);
            return(JSON.stringify(response))

    })
    .catch(error => {
        // Xử lý lỗi từ Promise
        console.error("Promise Error:", error);
    });

};

module.exports = {
    getUsersProfile,
};
