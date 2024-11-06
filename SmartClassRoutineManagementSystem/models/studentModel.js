// Import the database configuration
const db = require('../config/db');

/**
 * Creates the Student table if it does not already exist.
 * This table stores student information, including student ID, name, gender,
 * session ID, class roll number, exam roll number, registration number, email,
 * password, phone, and reset token details. It establishes a foreign key relationship
 * with the Session table via session_id.
 *
 * @function createXmlDataStudentTable
 * @async
 * @returns {void} Does not return anything but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the Student table exists
 * createXmlDataStudentTable();
 *
 * @see {@link ../config/db} for the database configuration.
 */
const createXmlDataStudentTable = () => {
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

    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Student table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('Student table created or already exists');
    });
};

/**
 * @module StudentTable
 * @description Module responsible for creating and managing the Student table.
 */
module.exports = {
    createXmlDataStudentTable
};
