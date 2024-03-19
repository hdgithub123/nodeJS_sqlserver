const sql = require('mssql');
const sqlstring = require('sqlstring');

async function executeQuery(sqlQuery, ...params) {
    const config = {
        user: 'sa',
        password: '123456',
        server: '10.0.0.1',
        port: 9000,
        database: 'MYDATABASE',
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
        
        // Trả về kết quả thành công
        return { Result: result.recordset, Status: "ok" };
    } catch (err) {
        console.error(err);
        // Trả về thông báo lỗi
        return { Result: err, Status: "error" };
    } finally {
        await sql.close();
    }
}

module.exports = { executeQuery };

