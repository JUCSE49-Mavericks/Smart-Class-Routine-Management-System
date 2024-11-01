const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');

/**
 * @function uploadDepartmentChairmanAsXML
 * @description Handles the upload of department chairman data in XML format. It parses the XML data,
 * clears the existing data in the DepartmentChairman table, and inserts the new data into the database.
 * @param {object} req - The request object containing the XML data in the body.
 * @param {object} res - The response object used to send back the desired HTTP response.
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
 * @function insertXmlTeacherIntoDatabase
 * @description Inserts a teacher's data into the DepartmentChairman table in the database.
 * @param {object} data - The data object containing dept_id and teacher_id.
 * @returns {Promise} A promise that resolves when the insertion is complete or rejects if an error occurs.
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
 * @function getDepartmentChairmanByDeptId
 * @description Retrieves the chairman details by department ID from the database.
 * @param {string} dept_id - The ID of the department for which the chairman is to be fetched.
 * @returns {Promise} A promise that resolves with the chairman details or null if no chairman is found.
 */
const getDepartmentChairmanByDeptId = (dept_id) => {
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
 * @function updateDepartmentChairman
 * @description Updates the teacher assigned as the department chairman for a given department ID.
 * @param {string} dept_id - The ID of the department whose chairman is to be updated.
 * @param {string} teacher_id - The ID of the new chairman to be assigned.
 * @returns {Promise} A promise that resolves when the update is complete or rejects if an error occurs.
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
 * @function clearTable
 * @description Clears all data from the specified table in the database.
 * @param {string} tableName - The name of the table to be cleared.
 * @returns {Promise} A promise that resolves when the table is cleared or rejects if an error occurs.
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
