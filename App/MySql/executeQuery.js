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

// Hàm executeQuery để thực hiện truy vấn SQL
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Lỗi khi thực hiện truy vấn:', error);
    throw error;
  }
};

exports = {
  executeQuery
};