/**
 * @module controllers/departmentChairmanController
 */

const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');


/**
 * Uploads department chairman data from an XML format.
 * This function receives XML data, parses it, and inserts
 * the data into the DepartmentChairman table in the database.
 * 
 * @function uploadDepartmentChairmanAsXML
 * @param {Object} req - The request object containing the XML data in the body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise that resolves when the data is imported successfully,
 * or rejects with an error if the import fails.
 */
const uploadDepartmentChairmanAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }

        const rows = result.root.row;
        try {
            await clearTable('DepartmentChairman');
            for (const row of rows) {
                const dept_id = row.dept_id && row.dept_id[0];
                const teacher_id = row.teacher_id && row.teacher_id[0];
                

                if (dept_id && teacher_id) {
                    
                    await insertXmlTeacherIntoDatabase({
                        dept_id,
                        teacher_id
                    });
                } else {
                    console.warn('Skipping incomplete row:', row);
                }
            }
            res.status(200).send('XML data imported successfully.');
        } catch (error) {
            console.error('Error importing XML data:', error);
            res.status(500).send('Error importing XML data.');
        }
    });
};


/**
 * Inserts a new department chairman record into the database.
 * 
 * @function insertXmlTeacherIntoDatabase
 * @param {Object} data - The data object containing dept_id and teacher_id.
 * @returns {Promise<Object>} - A promise that resolves to the results of the insert operation.
 * @throws {Error} Throws an error if the database operation fails.
 */
const insertXmlTeacherIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO DepartmentChairman (dept_id, teacher_id) VALUES (?, ?)';
        db.query(query, [data.dept_id, data.teacher_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


/**
 * Retrieves the department chairman's details by department ID.
 * 
 * @function getDepartmentChairmanByDeptId
 * @param {number} dept_id - The ID of the department to retrieve the chairman for.
 * @returns {Promise<Object|null>} - A promise that resolves to the chairman's details or null
 * if no chairman is found.
 * @throws {Error} Throws an error if the database operation fails.
 */
const getDepartmentChairmanByDeptId = (dept_id) => {
    // console.log(dept_id);
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Teacher.* 
            FROM DepartmentChairman 
            INNER JOIN Teacher ON DepartmentChairman.teacher_id = Teacher.teacher_id 
            WHERE DepartmentChairman.dept_id = ?`;
        db.query(sql, [dept_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0]); // Return the chairman details
            } else {
                resolve(null); // No chairman found
            }
        });
    });
};

/**
 * Updates the department chairman for a specific department.
 * 
 * @function updateDepartmentChairman
 * @param {number} dept_id - The ID of the department to update.
 * @param {number} teacher_id - The ID of the teacher to set as chairman.
 * @returns {Promise<Object>} - A promise that resolves to the results of the update operation.
 * @throws {Error} Throws an error if the database operation fails.
 */
const updateDepartmentChairman = (dept_id, teacher_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE DepartmentChairman
            SET teacher_id = ?
            WHERE dept_id = ?`;
        db.query(sql, [teacher_id, dept_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


/**
 * Clears all records from a specified table.
 * 
 * @function clearTable
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise<Object>} - A promise that resolves to the results of the clear operation.
 * @throws {Error} Throws an error if the database operation fails.
 */
const clearTable = (tableName) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${tableName}`;
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    uploadDepartmentChairmanAsXML,
    getDepartmentChairmanByDeptId,
    updateDepartmentChairman
};
