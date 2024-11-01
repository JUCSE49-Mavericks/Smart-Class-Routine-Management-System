const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');

/**
 * Uploads session data from XML format to the database.
 * 
 * @param {Object} req - The request object, containing the XML data.
 * @param {Object} res - The response object, used to send back the result.
 */
const uploadSessionAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }

        const rows = result.root.row;
        try {
            // Clear the existing Session table before importing new data
            await clearTable('Session');
            for (const row of rows) {
                const session_id = row.session_id && row.session_id[0];
                const dept_id = row.dept_id && row.dept_id[0];
                const Session_name = row.Session_name && row.Session_name[0];

                // Validate that required fields are present
                if (session_id && dept_id && Session_name) {
                    await insertXmlSessionIntoDatabase({
                        session_id,
                        dept_id,
                        Session_name
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
 * Inserts a session record into the database.
 * 
 * @param {Object} data - The session data to insert.
 * @returns {Promise} - Resolves when the insertion is complete.
 */
const insertXmlSessionIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Session (session_id, dept_id, Session_name) VALUES (?, ?, ?)';
        db.query(query, [data.session_id, data.dept_id, data.Session_name], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * Clears all records from a specified table.
 * 
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise} - Resolves when the table is cleared.
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

/**
 * Retrieves the department associated with a given session ID.
 * 
 * @param {number} session_id - The ID of the session to lookup.
 * @returns {Promise} - Resolves with the department details.
 */
const getDepartmentBySessionId = (session_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Department.*
            FROM Session
            INNER JOIN Department ON Session.dept_id = Department.dept_id
            WHERE Session.session_id = ?;
        `;
        db.query(sql, [session_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0]); // Return the department details
            } else {
                resolve(null); // No department found
            }
        });
    });
};

/**
 * Retrieves all sessions associated with a specific department.
 * 
 * @param {number} dept_id - The ID of the department to fetch sessions for.
 * @returns {Promise} - Resolves with an array of session records.
 */
const getSessionsByDepartmentId = (dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Session.*
            FROM Session
            INNER JOIN Department ON Session.dept_id = Department.dept_id
            WHERE Department.dept_id = ?`;
        
        db.query(sql, [dept_id], (err, rows) => {
            if (err) {
                console.error('Failed to fetch sessions:', err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

/**
 * Retrieves a session by its ID.
 * 
 * @param {number} session_id - The ID of the session to fetch.
 * @returns {Promise} - Resolves with the session record or null if not found.
 */
const getSessionById = (session_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Session.*
            FROM Session
            WHERE session_id = ?`;
        db.query(sql, [session_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null); // No session found
            }
        });
    });
};

/**
 * Adds a new session to the database.
 * 
 * @param {number} dept_id - The ID of the department to associate with the session.
 * @param {string} Session_name - The name of the session.
 * @returns {Promise} - Resolves when the session is added.
 */
const addNewSession = (dept_id, Session_name) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Session (dept_id, Session_name) VALUES (?, ?)`;
        db.query(sql, [dept_id, Session_name], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Deletes a session by its ID.
 * 
 * @param {number} session_id - The ID of the session to delete.
 * @returns {Promise} - Resolves when the session is deleted.
 */
const deleteSessionById = (session_id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Session WHERE session_id = ?`;
        db.query(sql, [session_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    uploadSessionAsXML,
    getDepartmentBySessionId,
    getSessionsByDepartmentId,
    getSessionById,
    addNewSession,
    deleteSessionById
};
