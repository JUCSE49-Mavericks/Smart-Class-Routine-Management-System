// models/updateClassRepresentativeModel.js

const db = require('../config/db');

/**
 * Get students by their exam year ID.
 * 
 * This function retrieves a list of students based on the given exam year ID. 
 * It performs a SQL query joining the Student, Session, and ExamYear tables to get relevant student details.
 * 
 * @param {number} exam_year_id - The ID of the exam year.
 * @returns {Promise<Object[]>} A promise that resolves to an array of student objects.
 * @throws {Error} If there is an issue with the database query, it rejects with an error.
 */
const getStudentsByExamYear = (exam_year_id) => {
    const query = `
        SELECT Student.*
        FROM Student
        JOIN Session ON Student.session_id = Session.session_id
        JOIN ExamYear ON Session.session_id = ExamYear.session_id
        WHERE ExamYear.exam_year_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

/**
 * Update the class representative for a given exam year.
 * 
 * This function inserts or updates the class representative for the given exam year. 
 * If a representative already exists, it updates the student's ID and role. 
 * If no representative exists, it inserts a new record.
 * 
 * @param {number} exam_year_id - The ID of the exam year.
 * @param {number} student_id - The ID of the student being assigned as a representative.
 * @param {string} role - The role assigned to the student (e.g., "Male" or "Female").
 * @returns {Promise<Object>} A promise that resolves to the result of the database query.
 * @throws {Error} If there is an issue with the database query, it rejects with an error.
 */
const updateClassRepresentative = (exam_year_id, student_id, role) => {
    const query = `
        INSERT INTO ClassRepresentative (exam_year_id, student_id, role)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            student_id = VALUES(student_id),
            role = VALUES(role);
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id, student_id, role], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    getStudentsByExamYear,
    updateClassRepresentative
};
