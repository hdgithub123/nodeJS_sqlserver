const sql = require('mssql');
const sqlstring = require('sqlstring');

require('dotenv').config();

async function executeQuery(sqlQuery, ...params) {
    
    const port = process.env.PORT || 9000;
    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        port: port,
        database: process.env.DB_DATABASE,
        options: {
            trustServerCertificate: true,
            encrypt: false // Tắt SSL/TLS ở đây
        }
    };

    try {
        const pool = await sql.connect(config);
        
        // Tạo truy vấn có tham số với sqlstring
        const query = sqlstring.format(sqlQuery, params);
        
        const result = await pool.request().query(query); // Thực thi truy vấn bằng pool.request().query()
        console.log("COMPLETED CONNECTION TO DATABASE");
        // Trả về kết quả thành công
        return { Result: result.recordset, Status: true };
    } catch (err) {
        console.error(err);
        // Trả về thông báo lỗi
        console.log("ERROR CONNECTION TO DATABASE");
        return { Result: err, Status: false };
    } finally {
        await sql.close();
    }
}

module.exports = { executeQuery };

