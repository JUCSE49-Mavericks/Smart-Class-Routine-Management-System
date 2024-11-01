// models/departmentChairmanModel.js

const db = require('../config/db');

/**
 * Creates the DepartmentChairman table in the database if it does not already exist.
 * The DepartmentChairman table establishes a many-to-many relationship 
 * between departments and their respective chairpersons.
 */
const createChairmanToDepartmentTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS DepartmentChairman (
            dept_id INT,
            teacher_id INT,
            PRIMARY KEY (dept_id, teacher_id),  // Composite primary key for dept_id and teacher_id
            FOREIGN KEY (dept_id) REFERENCES Department(dept_id),
            FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id)
        );
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating DepartmentChairman table:', err);
            throw err; // Rethrow the error for further handling if necessary
        }
        console.log('DepartmentChairman table created or already exists');
    });
};

module.exports = {
    createChairmanToDepartmentTable
};
