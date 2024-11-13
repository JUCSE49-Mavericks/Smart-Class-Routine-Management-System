/**
 * @module models/classRepresentativeModel
 */
const db = require('../config/db');


/**
 * Creates the `ClassRepresentative` table if it does not exist in the database.
 * This table includes foreign keys for `exam_year_id` (references `ExamYear`) and `student_id` (references `Student`).
 * The `role` field is an ENUM with values 'Male' and 'Female', ensuring unique representatives for each role per exam year.
 * @function createClassRepresentativeTable
 * @returns {void} - Logs success or error message based on table creation result.
 * @throws Will throw an error if there is an issue creating the table.
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
 * Fetches class representatives based on a specified `exam_year_id`.
 * @async
 * @function getClassRepresentativeByExamYearId
 * @param {number} exam_year_id - The ID of the exam year for which to fetch class representatives.
 * @returns {Promise<Array<Object>>} - Resolves to an array of class representative objects, or rejects with an error.
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
