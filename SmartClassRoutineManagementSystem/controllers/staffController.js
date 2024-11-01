const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');

/**
 * Uploads staff data from XML and imports it into the database.
 * 
 * @param {Object} req - The request object containing XML data.
 * @param {Object} res - The response object for sending responses.
 */
const uploadStaffAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }

        const rows = result.root.row;
        try {
            await clearTable('Staff');
            for (const row of rows) {
                const staff_id = row.staff_id && row.staff_id[0];
                const Name = row.Name && row.Name[0];
                const Role = row.Role && row.Role[0];
                const dept_id = row.dept_id && row.dept_id[0];
                const Email = row.Email && row.Email[0];
                const Password = row.Password && row.Password[0];
                const Phone = row.Phone && row.Phone[0];
                const resetToken = row.resetToken && row.resetToken[0];
                const resetTokenExpires = row.resetTokenExpires && row.resetTokenExpires[0];

                // Ensure all required fields are present before inserting
                if (staff_id && Name && Role && dept_id && Email && Password && Phone) {
                    const hashedPassword = await bcrypt.hash(Password, 10);
                    await insertXmlStaffIntoDatabase({
                        staff_id,
                        Name,
                        Role,
                        dept_id,
                        Email,
                        hashedPassword,
                        Phone,
                        resetToken,
                        resetTokenExpires
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
 * Inserts staff data into the database.
 * 
 * @param {Object} data - Staff data to be inserted.
 * @returns {Promise} - A promise that resolves when the insertion is complete.
 */
const insertXmlStaffIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Staff (staff_id, Name, Role, dept_id, Email, Password, Phone, resetToken, resetTokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [data.staff_id, data.Name, data.Role, data.dept_id, data.Email, data.hashedPassword, data.Phone, data.resetToken, data.resetTokenExpires], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * Clears the specified table in the database.
 * 
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise} - A promise that resolves when the table is cleared.
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
 * Retrieves staff information by email.
 * 
 * @param {string} email - The email of the staff member.
 * @returns {Promise} - A promise that resolves to the staff member's data.
 */
const getStaffByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Staff WHERE email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

/**
 * Retrieves staff information by reset token.
 * 
 * @param {string} token - The reset token for the staff member.
 * @returns {Promise} - A promise that resolves to the staff member's data.
 */
const getStaffByResetToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Staff WHERE resetToken = ? AND resetTokenExpires > NOW()";
        db.query(sql, [token], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

/**
 * Retrieves department information based on staff ID.
 * 
 * @param {string} staff_id - The ID of the staff member.
 * @returns {Promise} - A promise that resolves to the department details.
 */
const getDepartmentByStaffId = (staff_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Department.* 
            FROM Staff 
            INNER JOIN Department ON Staff.dept_id = Department.dept_id 
            WHERE Staff.staff_id = ?`;
        db.query(sql, [staff_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null); // No department found
            }
        });
    });
};

/**
 * Retrieves staff members by department ID.
 * 
 * @param {string} dept_id - The ID of the department.
 * @returns {Promise} - A promise that resolves to a list of staff members.
 */
const getStaffByDepartmentId = (dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * 
            FROM Staff 
            WHERE dept_id = ?`;

        db.query(sql, [dept_id], (err, result) => {
            if (err) {
                console.error('Error fetching staff:', err);
                return reject(err);
            }

            if (result.length > 0) {
                resolve(result);
            } else {
                resolve([]); // No staff found
            }
        });
    });
};

/**
 * Retrieves a staff member by their ID.
 * 
 * @param {string} staff_id - The ID of the staff member.
 * @returns {Promise} - A promise that resolves to the staff member's data.
 */
const getStaffById = (staff_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Staff WHERE staff_id = ?';
        db.query(sql, [staff_id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

/**
 * Updates a staff member's profile by their ID.
 * 
 * @param {string} staff_id - The ID of the staff member.
 * @param {Object} updatedData - The data to update.
 * @returns {Promise} - A promise that resolves when the update is complete.
 */
const updateStaffById = (staff_id, updatedData) => {
    return new Promise((resolve, reject) => {
        const { Name, Role, Email, Phone } = updatedData;
        const sql = 'UPDATE Staff SET Name = ?, Role = ?, Email = ?, Phone = ? WHERE staff_id = ?';
        db.query(sql, [Name, Role, Email, Phone, staff_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Adds a new staff member to a specified department.
 * 
 * @param {string} dept_id - The ID of the department.
 * @param {Object} staffData - The staff data to be added.
 * @param {string} hashedPassword - The hashed password for the staff member.
 * @returns {Promise} - A promise that resolves when the addition is complete.
 */
const addNewStaffToDepartment = (dept_id, staffData, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const { Name, Role, Email, Phone } = staffData;
        const sql = `
            INSERT INTO Staff (Name, Role, dept_id, Email, Phone, Password) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [Name, Role, dept_id, Email, Phone, hashedPassword], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Deletes a staff member by their ID.
 * 
 * @param {string} staff_id - The ID of the staff member to delete.
 * @returns {Promise} - A promise that resolves when the deletion is complete.
 */
const deleteDepartmentStaffById = (staff_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM Staff WHERE staff_id = ?
        `;
        db.query(sql, [staff_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    uploadStaffAsXML,
    getStaffByEmail,
    getStaffByResetToken,
    getDepartmentByStaffId,
    getStaffByDepartmentId,
    getStaffById,
    updateStaffById,
    addNewStaffToDepartment,
    deleteDepartmentStaffById
};
