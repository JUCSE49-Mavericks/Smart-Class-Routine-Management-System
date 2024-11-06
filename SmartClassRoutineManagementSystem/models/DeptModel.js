/**
 * @fileoverview Defines the Department table in the database if it does not already exist.
 * @module createXmlDataDeptTable
 */

const db = require('../config/db');

/**
 * Creates the Department table if it does not already exist.
 * The table includes the following fields:
 * - dept_id: Primary key with auto-increment.
 * - Dept_Name: Department name as a VARCHAR field.
 * - Descript: Description of the department.
 * - Phone: Contact phone number.
 * - Fax: Fax number.
 * - Email: Email address.
 * 
 * @function
 * @param {void} No parameters are required.
 * @returns {void} Logs a message indicating the table's creation status or any error encountered.
 */
const createXmlDataDeptTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Department (
            dept_id INT AUTO_INCREMENT PRIMARY KEY,
            Dept_Name VARCHAR(255),
            Descript VARCHAR(255),
            Phone VARCHAR(255),
            Fax VARCHAR(255),
            Email VARCHAR(255)
        );
    `;

    // Executes the SQL query to create the Department table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Department table:', err);
            throw err;
        }
        console.log('Department table created or already exists');
    });
};

/**
 * @module createXmlDataDeptTable
 * @description Module responsible for creating and managing Department table.
 */
module.exports = {
    createXmlDataDeptTable
};
