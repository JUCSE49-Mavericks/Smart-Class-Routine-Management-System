// Import the database configuration
const db = require('../config/db');

/**
 * Creates the Room table if it does not already exist.
 * The table stores information about rooms, including the room number,
 * room type, capacity, and department to which the room belongs.
 * It establishes a foreign key relationship with the Department table via dept_id.
 *
 * @function createXmlDataRoomTable
 * @async
 * @returns {void} Does not return anything but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the Room table exists
 * createXmlDataRoomTable();
 *
 * @see {@link ../config/db} for the database configuration.
 */
const createXmlDataRoomTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Room (
            room_id INT AUTO_INCREMENT PRIMARY KEY,
            Room_no VARCHAR(255) NOT NULL,
            Room_type ENUM('Class Room', 'Lab Room', 'Lecture Hall', 'Computer Lab', 'Seminar Room') NOT NULL,
            Capacity INT NOT NULL,
            dept_id INT NOT NULL,
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        );
    `;

    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating Room table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('Room table created or already exists');
    });
};

/**
 * @module RoomTable
 * @description Module responsible for creating and managing the Room table.
 */
module.exports = {
    createXmlDataRoomTable
};
