// models/teacherModel.js
const db = require('../config/db');

/**
 * Creates the Teacher table if it does not already exist.
 * This table stores teacher information, including teacher ID, name, profile image,
 * designation, department ID, abbreviation, email, password, phone, and reset token details.
 * It establishes a foreign key relationship with the Department table via dept_id.
 *
 * @function createXmlDataTeacherTable
 * @async
 * @returns {void} Does not return anything but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the Teacher table exists
 * createXmlDataTeacherTable();
 *
 * @see {@link ../config/db} for the database configuration.
 */
const createXmlDataTeacherTable = () => {
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
    
    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Teacher table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('Teacher table created or already exists');
    });
};

/**
 * Updates the profile image for a specific teacher in the Teacher table.
 * This function takes a teacher's ID and the new profile image path to update the teacher's record.
 *
 * @function updateProfileImage
 * @async
 * @param {number} teacher_id - The ID of the teacher whose profile image is to be updated.
 * @param {string} profileImage - The new profile image path to be saved.
 * @param {Function} callback - The callback function to handle the query results.
 * @returns {void} Executes the update query and calls the callback function with the results.
 * @throws {Error} Throws an error if the update query fails.
 *
 * @example
 * // Call the function to update a teacher's profile image
 * updateProfileImage(1, 'path/to/new/image.jpg', (err, result) => {
 *     if (err) {
 *         console.error('Error updating profile image:', err);
 *     } else {
 *         console.log('Profile image updated successfully');
 *     }
 * });
 */
const updateProfileImage = (teacher_id, profileImage, callback) => {
    const query = `
      UPDATE Teacher
      SET profileImage = ?
      WHERE teacher_id = ?;
    `;
    
    // Execute the query to update the profile image
    db.query(query, [profileImage, teacher_id], callback);
};

/**
 * @module TeacherModel
 * @description Module responsible for creating and managing the Teacher table and updating teacher profile images.
 */
module.exports = {
    createXmlDataTeacherTable,
    updateProfileImage
};
