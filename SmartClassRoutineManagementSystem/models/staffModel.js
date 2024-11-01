// models/staffModel.js

const db = require('../config/db');

/**
 * Creates the Staff table in the database if it does not already exist.
 * 
 * The Staff table stores information about the staff members of the institution, 
 * including their roles, contact details, and department affiliation.
 * 
 * @function createXmlDataStaffTable
 * @returns {void} This function does not return a value. It creates the Staff table in the database.
 * 
 * @throws {Error} Throws an error if the table creation fails, which can be caught and handled by the calling function.
 * 
 * @example
 * // Call the function to create the Staff table
 * createXmlDataStaffTable();
 */
const createXmlDataStaffTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Staff (
            staff_id INT AUTO_INCREMENT PRIMARY KEY,     // Unique identifier for each staff member
            Name VARCHAR(255) NOT NULL,                  // Name of the staff member, cannot be null
            Role VARCHAR(255),                            // Role of the staff member within the institution
            dept_id INT,                                  // Department ID to which the staff member belongs
            Email VARCHAR(255),                           // Email address of the staff member
            Password VARCHAR(700),                        // Hashed password for staff member authentication
            Phone VARCHAR(255),                           // Contact phone number of the staff member
            resetToken VARCHAR(255),                      // Token used for password reset functionality
            resetTokenExpires DATETIME,                   // Expiration date and time of the reset token
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id) // Foreign key referencing the Department table
        );
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Staff table:', err); // Updated error message for clarity
            throw err; // Rethrow the error for further handling if necessary
        }
        console.log('Staff table created or already exists');
    });
};

module.exports = {
    createXmlDataStaffTable
};
