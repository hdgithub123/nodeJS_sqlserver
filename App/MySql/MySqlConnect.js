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
        pool = await new sql.ConnectionPool(config).connect();
    }
    return pool;
};
const executeQuery = async (sqlQuery, ...params) => {
    try {
        const pool = await initializePool();
        const request = pool.request();
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        
        // Thay thế các dấu ? trong sqlQuery bằng tên tham số tương ứng
        let modifiedSqlQuery = sqlQuery;
        for (let i = 1; i <= params.length; i++) {
            modifiedSqlQuery = modifiedSqlQuery.replace(`?`, `@param${i}`);
        }

        const result = await request.query(modifiedSqlQuery);
        console.log("COMPLETED CONNECTION TO DATABASE");
        return { Result: result.recordset, Status: true };
    } catch (err) {
        console.error(err);
        console.log("ERROR CONNECTION TO DATABASE");
        return { Result: err, Status: false };
    }
};



/**
 *Inserts an object into a specified table.
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

/**
 * Updates data in a specified table based on a specified column.
 * @param {string} table - The name of the table to update data in.
 * @param {Object} object - An object representing the updated data. It should have keys corresponding to the table columns.
 * @param {string} columKey - The name of the column to use in the WHERE clause for the update operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the update operation.
 */
async function updateObject(table, object, columKey) {
    try {
        const keys = Object.keys(object); // Get the keys from the object
        const setClause = keys.map(key => `${key} = ?`).join(','); // Create the SET clause for the update
        const values = Object.values(object); // Get the values to be updated
        const whereClause = Object.keys(columKey).map(key => `${key} = ?`).join(' AND '); // Create the WHERE clause
        const whereValues = Object.values(columKey); // Get the values for the WHERE clause
        const sqlQuery = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`; // Create the SQL query
        const { Result, Status } = await executeQuery(sqlQuery, ...values, ...whereValues); // Execute the query
        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

/**
 * Deletes data from a specified table based on specified columns and their corresponding values.
 * @param {string} table - The name of the table to delete data from.
 * @param {Object} columKey - An object containing column names and their corresponding values for comparison in the WHERE clause for the delete operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the delete operation.
 */
async function deleteObject(table, columKey) {
    try {
        const setClause = Object.keys(columKey).map(key => `${key} = ?`).join(' AND '); // Create the SET clause for the delete
        const values = Object.values(columKey); // Get the values to be used in the WHERE clause
        const sqlQuery = `DELETE FROM ${table} WHERE ${setClause}`; // Create the SQL query
        const { Result, Status } = await executeQuery(sqlQuery, ...values); // Execute the query
        return { Result: null, Status:true };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}


/*** 
 *Inserts data into a specified table.
 * @param {string} table - The name of the table to insert data into.
 * @param {Array<Object>} data - An array of objects representing the data to be inserted. Each object should have keys corresponding to the table columns.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the insertion operation.
 */
 async function insertObjects(table, data) {
    try {
        const keys = Object.keys(data[0]); // Lấy danh sách các trường từ object đầu tiên
        const placeholders = data.map(() => `(${keys.map(() => '?').join(',')})`).join(','); // Tạo chuỗi placeholders cho các giá trị
        const columns = keys.join(','); // Tạo chuỗi các trường cần insert
        const values = data.flatMap(item => Object.values(item)); // Tạo mảng giá trị từ mảng dữ liệu
        
        const sqlQuery = `INSERT INTO ${table} (${columns}) VALUES ${placeholders};`; // Tạo câu truy vấn insert
        const { Result, Status } = await executeQuery(sqlQuery, ...values); // Thực thi truy vấn

        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}


/**
 * Updates data in a specified table based on a specified column.
 * @param {string} table - The name of the table to update data in.
 * @param {Array<Object>} data - An array of objects representing the data to be updated. Each object should have keys corresponding to the table columns.
 * @param {Array<string>} columKey - An array containing the names of the columns used for comparison in the WHERE clause for the update operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the update operation.
 */
async function updateObjects(table, data, columKey) {
    try {
        let sqlQuery = 'BEGIN TRANSACTION; ';
        let allValues = [];
        // Iterate through each object in data
        data.forEach(item => {
            // Initialize setClause, whereClause, và itemValues
            let setClause = '';
            let whereClause = '';     
            // Iterate through keys of the item
            Object.keys(item).forEach(key => {
                // Check if the key exists in columKey
                if (columKey.includes(key)) {

                } else {
                    // Append to setClause và itemValues
                    setClause += `${key} = ?, `;
                    allValues.push(item[key]);
                }
            });

            Object.keys(item).forEach(key => {
                // Check if the key exists in columKey
                if (columKey.includes(key)) {
                    // Append to whereClause và itemValues
                    whereClause += `${key} = ? AND `;
                    allValues.push(item[key]);
                } else {

                }
            });
        
            // Remove trailing commas from setClause và whereClause
            setClause = setClause.replace(/,\s*$/, '');
            whereClause = whereClause.replace(/ AND\s*$/, '');
        
            // Append the UPDATE statement to the SQL query
            sqlQuery += `UPDATE ${table} SET ${setClause} WHERE ${whereClause}; `;
        
        });

        sqlQuery += 'COMMIT;';
        // Execute the SQL query with values
        const { Result, Status } = await executeQuery(sqlQuery, ...allValues);

        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}

/**
 * Deletes data from a specified table based on specified columns and their corresponding values.
 * @param {string} table - The name of the table to delete data from.
 * @param {Object} columKey - An object containing column names and their corresponding values for comparison in the WHERE clause for the delete operation.
 * @returns {Promise<{Result: Object, Status: boolean}>} - An object containing the result and status of the delete operation.
 */
async function deleteObjects(table, columKey) {
    try {
        let sqlQuery = 'BEGIN TRANSACTION; ';
        
        columKey.forEach(obj => {
            const conditions = [];
            for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    conditions.push(`${key} = '${value}'`);
                }
            }
            const whereClause = conditions.join(' AND ');
            sqlQuery += `DELETE FROM ${table} WHERE ${whereClause}; `;
        });

        sqlQuery += 'COMMIT;';
        
        const { Result, Status } = await executeQuery(sqlQuery); // Execute the query
        return { Result, Status };
    } catch (error) {
        console.error(error);
        return { Result: error, Status: false };
    }
}


module.exports = { 
    executeQuery,
    insertObject,
    updateObject,
    deleteObject,
    insertObjects,
    updateObjects,
    deleteObjects
};
