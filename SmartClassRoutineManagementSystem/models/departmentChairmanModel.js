/**
 * @module models/departmentChairmanModel
 */

const db = require('../config/db');


/**
 * Creates the DepartmentChairman table if it does not already exist.
 * The table associates department IDs with teacher IDs, establishing a
 * many-to-many relationship between departments and their chairpersons.
 * 
 * The primary key for this table is a composite key consisting of 
 * department ID and teacher ID. Both fields reference the corresponding
 * IDs in the Department and Teacher tables.
 * 
 * @function createChairmanToDepartmentTable
 * @returns {Promise<void>} - A promise that resolves when the table creation is complete.
 * @throws {Error} Throws an error if the table creation fails.
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
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating xml_teacher_data table:', err);
            throw err;
        }
        console.log('Department-Chairman table created or already exists');
    });
};

module.exports = {
    createChairmanToDepartmentTable
}