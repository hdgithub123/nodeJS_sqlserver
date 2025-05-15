const mysql = require('mysql2/promise');

// Tạo kết nối với MySQL
const pool = mysql.createPool({
  host: '100.0.0.1',
  user: 'admin',
  port: '3306',
  password: 'admin123456',
  database: 'sakila',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Executes an SQL query using the MySQL connection pool.
 * @param {string} query - The SQL statement to execute.
 * @param {Array} params - An array of parameters for the SQL statement (optional).
 * @returns {Promise<Object>} - Returns a Promise with an object containing:
 *    - data: The query result (rows) or undefined if an error occurs.
 *    - status: true if successful, or the error object if failed.
 * 
 * If an error occurs during execution, the error is logged and returned in the result.
 */

const executeMySqlQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return {
      data: rows,
      status: true,
      errorCode: null
    };
  } catch (error) {
    console.error('Lỗi khi thực hiện truy vấn:', error);
    return {
      data: null,
      status: false,
      errorCode: error.code || 'UNKNOWN_ERROR'
    };
  }
};

module.exports = {
  executeMySqlQuery
};