// models/roomModel.js

const db = require('../config/db');

/**
 * Creates the Room table in the database if it does not already exist.
 * 
 * The Room table stores information about various rooms available in the institution.
 * Each room is associated with a specific department and has defined attributes 
 * such as room number, type, and capacity.
 * 
 * @function createXmlDataRoomTable
 * @returns {void} This function does not return a value. It only creates the table in the database.
 * 
 * @throws {Error} Throws an error if the table creation fails, which can be caught and handled by the calling function.
 * 
 * @example
 * // Call the function to create the Room table
 * createXmlDataRoomTable();
 */
const createXmlDataRoomTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Room (
            room_id INT AUTO_INCREMENT PRIMARY KEY,  // Unique identifier for each room
            Room_no VARCHAR(255) NOT NULL,           // Room number, cannot be null
            Room_type ENUM('Class Room', 'Lab Room', 'Lecture Hall', 'Computer Lab', 'Seminar Room') NOT NULL, // Type of the room
            Capacity INT NOT NULL,                    // Maximum capacity of the room
            dept_id INT NOT NULL,                     // Department ID to which the room belongs
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id)  // Foreign key referencing the Department table
        );
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Room table:', err); // Updated error message for clarity
            throw err; // Rethrow the error for further handling if necessary
        }
        console.log('Room table created or already exists');
    });
};

module.exports = {
    createXmlDataRoomTable
};
