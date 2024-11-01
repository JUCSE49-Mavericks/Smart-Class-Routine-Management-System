/**
 * @author Sadia Hossain
 */
// Importing the database configuration module
const db = require('../config/db');

/**
 * @file Student Table Creation
 * @description Defines the function to create the 'Student' table in the database.
 * This table includes columns for storing student details such as name, gender,
 * session ID, class roll, and other identifying information.
 * 
 * @module StudentTable
 * @requires ../config/db
 * @since 1.0.0
 * 
 * @example
 * const { createXmlDataStudentTable } = require('./path/to/module');
 * createXmlDataStudentTable();
 */

/**
 * Creates the 'Student' table in the database if it does not already exist.
 * The table includes fields for storing each student's personal information,
 * educational details, and contact information.
 * 
 * @function createXmlDataStudentTable
 * @memberof module:StudentTable
 * @returns {void}
 * @throws {Error} Throws an error if the table creation query fails.
 * @description Initializes the 'Student' table, defining various columns
 * with constraints, including unique fields like exam roll and registration number.
 */
const createXmlDataStudentTable = () => {
    /**
     * @constant {string} query
     * @description SQL query to create the 'Student' table with specified columns
     * and relationships. This includes various columns for storing student details
     * with constraints such as 'NOT NULL' and 'UNIQUE'.
     * @private
     */
    const query = `
        CREATE TABLE IF NOT EXISTS Student (
            student_id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            Gender ENUM('Male', 'Female') NOT NULL,
            session_id INT NOT NULL,
            Class_roll VARCHAR(255) NOT NULL,
            Exam_roll VARCHAR(255) UNIQUE NOT NULL,
            Registration_no VARCHAR(255) UNIQUE NOT NULL,
            Email VARCHAR(255) NOT NULL,
            Password VARCHAR(700) NOT NULL,
            Phone VARCHAR(255) NOT NULL,
            resetToken VARCHAR(255),
            resetTokenExpires DATETIME,
            FOREIGN KEY (session_id) REFERENCES Session(session_id)
        );
    `;

    /**
     * Executes the SQL query to create the Student table.
     * Logs a success message if the table is created or already exists.
     * If an error occurs, logs the error message and rethrows the error.
     * 
     * @param {Error|null} err - Error object if an error occurs, otherwise null.
     * @param {Object} results - Result of the query execution.
     * @callback queryCallback
     * @private
     */
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Student table:', err);
            throw err;
        }
        console.log('Student table created or already exists');
    });
};

// Export the function for external use
module.exports = {
    createXmlDataStudentTable
};
