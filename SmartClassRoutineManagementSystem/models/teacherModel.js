// Importing the database configuration module
const db = require('../config/db');

/**
 * @file Teacher Model
 * @description Defines functions for creating and managing the 'Teacher' table in the database.
 * The module includes methods for initializing the table and updating teacher profile images.
 * 
 * @module TeacherModel
 * @requires ../config/db
 * @since 1.0.0
 */

/**
 * Creates the 'Teacher' table in the database if it does not already exist.
 * This table stores teacher-specific information, such as name, designation,
 * department ID, email, phone number, and password.
 * 
 * @function createXmlDataTeacherTable
 * @memberof module:TeacherModel
 * @returns {void}
 * @throws {Error} Throws an error if the table creation query fails.
 * @description Initializes the 'Teacher' table with necessary columns and foreign key constraints.
 */
const createXmlDataTeacherTable = () => {
    /**
     * @constant {string} query
     * @description SQL query for creating the 'Teacher' table with columns for
     * teacher ID, name, profile image, designation, department, email, phone, and password.
     * @private
     */
    const query = `
        CREATE TABLE IF NOT EXISTS Teacher (
            teacher_id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            profileImage VARCHAR(255),
            Designation ENUM('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer') NOT NULL,
            dept_id INT,
            Abvr VARCHAR(255),
            Email VARCHAR(255),
            Password VARCHAR(700),
            Phone VARCHAR(255),
            resetToken VARCHAR(255),
            resetTokenExpires DATETIME,
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        );
    `;

    /**
     * Executes the SQL query to create the Teacher table.
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
            console.error('Error creating Teacher table:', err);
            throw err;
        }
        console.log('Teacher table created or already exists');
    });
};

/**
 * Updates the profile image URL for a specific teacher in the 'Teacher' table.
 * 
 * @function updateProfileImage
 * @memberof module:TeacherModel
 * @param {number} teacher_id - The unique ID of the teacher whose profile image is being updated.
 * @param {string} profileImage - The URL of the new profile image.
 * @param {function(Error|null, Object): void} callback - Callback function to handle the query result.
 * @returns {void}
 * @throws {Error} Throws an error if the update query fails.
 * 
 * @example
 * updateProfileImage(1, 'path/to/image.jpg', (err, results) => {
 *   if (err) {
 *     console.error('Error updating profile image:', err);
 *   } else {
 *     console.log('Profile image updated successfully');
 *   }
 * });
 */
const updateProfileImage = (teacher_id, profileImage, callback) => {
    /**
     * @constant {string} query
     * @description SQL query to update the profileImage column in the 'Teacher' table.
     * @private
     */
    const query = `
      UPDATE Teacher
      SET profileImage = ?
      WHERE teacher_id = ?;
    `;

    db.query(query, [profileImage, teacher_id], callback);
};

// Exporting functions for external use
module.exports = {
    createXmlDataTeacherTable,
    updateProfileImage
};
