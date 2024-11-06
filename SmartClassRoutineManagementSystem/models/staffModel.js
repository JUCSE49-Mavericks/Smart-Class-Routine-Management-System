// Import the database configuration
const db = require('../config/db');

/**
 * Creates the Staff table if it does not already exist.
 * This table stores staff information, including staff ID, name, role, department ID,
 * email, password, phone, and reset token details. It establishes a foreign key relationship
 * with the Department table via dept_id.
 *
 * @function createXmlDataStaffTable
 * @async
 * @returns {void} Does not return anything but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the Staff table exists
 * createXmlDataStaffTable();
 *
 * @see {@link ../config/db} for the database configuration.
 */
const createXmlDataStaffTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Staff (
            staff_id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            Role VARCHAR(255),
            dept_id INT,
            Email VARCHAR(255),
            Password VARCHAR(700),
            Phone VARCHAR(255),
            resetToken VARCHAR(255),
            resetTokenExpires DATETIME,
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        );
    `;

    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Staff table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('Staff table created or already exists');
    });
};

/**
 * @module StaffTable
 * @description Module responsible for creating and managing the Staff table.
 */
module.exports = {
    createXmlDataStaffTable
};
