// models/sessionModel.js

const db = require('../config/db');

/**
 * Creates the Session table in the database if it does not already exist.
 * 
 * The Session table stores information about academic sessions associated with departments.
 * 
 * @function createXmlDataSessionTable
 * @returns {void} This function does not return a value. It only creates the table in the database.
 * 
 * @throws {Error} Throws an error if the table creation fails, which can be caught and handled by the calling function.
 * 
 * @example
 * // Call the function to create the Session table
 * createXmlDataSessionTable();
 */
const createXmlDataSessionTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Session (
            session_id INT AUTO_INCREMENT PRIMARY KEY,   // Unique identifier for each session
            dept_id INT,                                 // Department ID associated with the session
            Session_name VARCHAR(255) NOT NULL,         // Name of the session, cannot be null
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id)  // Foreign key referencing the Department table
        );
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Session table:', err); // Updated error message for clarity
            throw err; // Rethrow the error for further handling if necessary
        }
        console.log('Session table created or already exists');
    });
};

module.exports = {
    createXmlDataSessionTable
};
