// Import the database configuration
const db = require('../config/db');

/**
 * Creates the DepartmentChairman table if it does not exist.
 * The table establishes a many-to-many relationship between departments and their chairpersons.
 *
 * @function createChairmanToDepartmentTable
 * @async
 * @returns {void} Does not return anything, but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the DepartmentChairman table exists
 * createChairmanToDepartmentTable();
 *
 * @see {@link ../config/db} for the database configuration.
 */
const createChairmanToDepartmentTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS DepartmentChairman (
            dept_id INT,
            teacher_id INT,
            PRIMARY KEY (dept_id, teacher_id),
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id),
            FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id)
        );
    `;

    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating DepartmentChairman table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('DepartmentChairman table created or already exists');
    });
};

/**
 * @module DepartmentChairmanTable
 * @description Module responsible for creating and managing the DepartmentChairman table.
 */
module.exports = {
    createChairmanToDepartmentTable
};
