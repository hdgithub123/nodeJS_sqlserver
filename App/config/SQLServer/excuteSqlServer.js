const sql = require('mssql');
const sqlstring = require('sqlstring');

require('dotenv').config();

/**
 * Executes an SQL query on the database and returns the result of the query.
 * @param {string} sqlQuery - The SQL query to be executed.
 * @param {...any} params - The parameters used in the SQL query.
 * @returns {Promise<{ Result: any, Status: boolean }>} - A promise resolved with an object containing the query result and its status.
 */
let pool;
const initializePool = async () => {
    if (!pool) {
        // const port = process.env.PORT || 9000 // Cách này cho dia chi 10.0.0.1 -- chua biet tai sao;
       const port = process.env.PORT;
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            port: port,
            database: process.env.DB_DATABASE,
            options: {
                trustServerCertificate: true,
                encrypt: false, // Tắt SSL/TLS ở đây
                enableArithAbort: true
            }
        };
        pool = await new sql.ConnectionPool(config).connect();
    }
    return pool;
};
const executeQuery = async (sqlQuery, params=[]) => {
    try {
        const pool = await initializePool();
        const request = pool.request();
        if (Array.isArray(params)) {
            params.forEach((param, index) => {
                request.input(`param${index + 1}`, param);
            });
        }
        
        // Thay thế các dấu ? trong sqlQuery bằng tên tham số tương ứng
        let modifiedSqlQuery = sqlQuery;
        for (let i = 1; i <= params.length; i++) {
            modifiedSqlQuery = modifiedSqlQuery.replace(`?`, `@param${i}`);
        }

        const result = await request.query(modifiedSqlQuery);
        console.log("COMPLETED CONNECTION TO DATABASE");
        return { data: result.recordset, status: true, errorCode: null };
    } catch (err) {
        console.error(err);
        console.log("ERROR CONNECTION TO DATABASE");
        return { data: null, status: false, errorCode: err.code || 'UNKNOWN_ERROR' };
    }
};

module.exports = {
  executeQuery
};