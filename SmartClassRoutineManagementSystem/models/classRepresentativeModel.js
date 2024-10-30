// models/classRepresentativeModel.js

/**
 * Model for managing ClassRepresentative table and data.
 * @module models/classRepresentativeModel
 */

const db = require('../config/db');

/**
 * Creates the ClassRepresentative table in the database if it doesn't already exist.
 * The table contains the class representative's ID, exam year ID, student ID, and role (Male or Female).
 * Sets up foreign key relationships with the ExamYear and Student tables.
 *
 * @function createClassRepresentativeTable
 * @throws {Error} If there is an issue creating the table.
 */



const createClassRepresentativeTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ClassRepresentative (
            cr_id INT AUTO_INCREMENT PRIMARY KEY,
            exam_year_id INT NOT NULL,
            student_id INT NOT NULL,
            role ENUM('Male', 'Female') NOT NULL,
            FOREIGN KEY (exam_year_id) REFERENCES ExamYear(exam_year_id),
            FOREIGN KEY (student_id) REFERENCES Student(student_id),
            UNIQUE (exam_year_id, role)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating ClassRepresentative table:', err);
            throw err;
        }
        console.log('ClassRepresentative table created or already exists');
    });
};

/**
 * Fetches class representatives based on the given exam year ID.
 *
 * @function getClassRepresentativeByExamYearId
 * @param {number} exam_year_id - The ID of the exam year to search for.
 * @returns {Promise<Object[]>} Resolves to an array of class representative records.
 * @throws {Error} If there is an issue fetching the data.
 */



const getClassRepresentativeByExamYearId = (exam_year_id) => {
    const query = `
        SELECT * 
        FROM ClassRepresentative 
        WHERE exam_year_id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id], (err, results) => {
            if (err) {
                console.error('Error fetching class representatives:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    createClassRepresentativeTable,
    getClassRepresentativeByExamYearId
};
