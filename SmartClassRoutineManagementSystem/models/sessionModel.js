// Import the database configuration
const db = require('../config/db');

/**
 * Creates the Session table if it does not already exist.
 * This table stores session information, including the session ID,
 * department ID, and session name. It establishes a foreign key relationship
 * with the Department table via dept_id.
 *
 * @function createXmlDataSessionTable
 * @async
 * @returns {void} Does not return anything but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the Session table exists
 * createXmlDataSessionTable();
 *
 * @see {@link ../config/db} for the database configuration.
 */
const createXmlDataSessionTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Session (
            session_id INT AUTO_INCREMENT PRIMARY KEY,
            dept_id INT,
            Session_name VARCHAR(255) NOT NULL,
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        );
    `;

    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Session table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('Session table created or already exists');
    });
};

/**
 * @module SessionTable
 * @description Module responsible for creating and managing the Session table.
 */
module.exports = {
    createXmlDataSessionTable
};
