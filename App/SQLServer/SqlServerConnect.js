const sql = require('mssql');
const sqlstring = require('sqlstring');

require('dotenv').config();

/**Executes an SQL query on the database and returns the result of the query.
 * @param {string} sqlQuery - The SQL query to be executed.
 * @param {...any} params - The parameters used in the SQL query.
 * @returns {Promise<{ Result: any, Status: boolean }>} - A promise resolved with an object containing the query result and its status.
 */
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

/**Inserts an object into a specified table.
 * @param {string} table - The name of the table to insert data into.
 * @param {Object} object - An object representing the data to be inserted. It should have keys corresponding to the table columns.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the insert operation.
 */
async function insertObject(table, object) {
    try {
        const keys = Object.keys(object);
        const placeholders = keys.map(() => '?').join(',');
        const values = keys.map(key => object[key]);
        const sqlQuery = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
        const { Result, Status } = await executeQuery(sqlQuery, ...values);
        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

/**Updates data in a specified table based on the value of a specified key.
 * 
 * @param {string} table - The name of the table to update data in.
 * @param {Object} object - An object representing the updated data. It should have keys corresponding to the table columns.
 * @param {string} idKey - The name of the key column to use in the WHERE clause for the update operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the update operation.
 */
async function updateObject(table, object, idKey) {
    try {
        const keys = Object.keys(object).filter(key => key !== idKey);
        const setClause = keys.map(key => `${key} = ?`).join(',');
        const sqlQuery = `UPDATE ${table} SET ${setClause} WHERE ${idKey} = ?`;
        const values = [...keys.map(key => object[key]), object[idKey]];
        const { Result, Status } = await executeQuery(sqlQuery, ...values);
        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

/** Deletes an object from a specified table based on the value of a specified key.
 * @param {string} table - The name of the table to delete data from.
 * @param {Object} object - An object representing the data to be deleted. It should have keys corresponding to the table columns.
 * @param {string} idKey - The name of the key column to use in the WHERE clause for the delete operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the delete operation.
 */
async function deleteObject(table, object, idKey) {
    try {
        const sqlQuery = `DELETE FROM ${table} WHERE ${idKey} = ?`;
        const { Result, Status } = await sqldata.executeQuery(sqlQuery, object[idKey]);
        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}


/*** Inserts data into a specified table.
 * @param {string} table - The name of the table to insert data into.
 * @param {Array<Object>} data - An array of objects representing the data to be inserted. Each object should have keys corresponding to the table columns.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the insertion operation.
 */
async function insertData(table, data) {
    try {
        const keys = Object.keys(data[0]); // Lấy danh sách các trường từ object đầu tiên
        const placeholders = keys.map(() => '?').join(','); // Tạo chuỗi placeholders cho các giá trị
        const columns = keys.join(','); // Tạo chuỗi các trường cần insert
        const values = data.flatMap(item => Object.values(item)); // Tạo mảng giá trị từ mảng dữ liệu
        
        const sqlQuery = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`; // Tạo câu truy vấn insert
        
        const { Result, Status } = await executeQuery(sqlQuery, ...values); // Thực thi truy vấn

        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

/**Updates data in a specified table based on a specified key.
 * @param {string} table - The name of the table to update data in.
 * @param {Array<Object>} data - An array of objects representing the data to be updated. Each object should have keys corresponding to the table columns.
 * @param {string} idKey - The name of the key column to use in the WHERE clause for the update operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the update operation.
 */
async function updateData(table, data, idKey) {
    try {
        const keys = Object.keys(data[0]); // Lấy danh sách các trường từ object đầu tiên
        const columns = keys.filter(key => key !== idKey).join(','); // Lọc ra danh sách các trường cần cập nhật (loại bỏ idKey)
        const placeholders = keys.map(key => (key !== idKey ? `${key} = ?` : '')).filter(Boolean).join(','); // Tạo chuỗi placeholders cho các giá trị cần cập nhật
        const values = data.flatMap(item => (item[idKey] ? Object.values(item) : [])); // Lọc ra giá trị cần cập nhật (loại bỏ các dòng không có idKey)

        const sqlQuery = `UPDATE ${table} SET ${placeholders} WHERE ${idKey} = ?`; // Tạo câu truy vấn update
        
        const { Result, Status } = await executeQuery(sqlQuery, ...values); // Thực thi truy vấn

        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

/**Deletes data from a specified table based on a specified key.
 * @param {string} table - The name of the table to delete data from.
 * @param {Array<Object>} data - An array of objects representing the data to be deleted. Each object should have keys corresponding to the table columns.
 * @param {string} idKey - The name of the key column to use in the WHERE clause for the delete operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the delete operation.
 */
async function deleteData(table, data, idKey) {
    try {
        let sqlQuery = 'BEGIN TRANSACTION; ';
        data.forEach(item => {
            const idKeyValue = item[idKey]; // Get the value of the specified key column
            sqlQuery += `DELETE FROM ${table} WHERE ${idKey} = ?; `;
        });
        sqlQuery += 'COMMIT;';
        
        const values = data.map(item => item[idKey]); // Get an array of id values
        
        const { Result, Status } = await executeQuery(sqlQuery, ...values); // Execute the query

        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

module.exports = { 
    insertObject,
    updateObject,
    deleteObject,
    executeQuery,
    insertData,
    updateData,
    deleteData

};

