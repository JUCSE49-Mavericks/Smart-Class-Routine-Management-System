/**
 * @module models/examYearModel
 */

const db = require('../config/db');

/**
 * Creates the ExamYear table in the database if it does not exist.
 * @function createXmlDataExamYearTable
 * @throws Will throw an error if the table creation fails.
 */
const createXmlDataExamYearTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ExamYear (
            exam_year_id INT AUTO_INCREMENT PRIMARY KEY,
            session_id INT NOT NULL,
            Education_level ENUM('Graduate', 'Undergraduate', 'Postgraduate') NOT NULL,
            Exam_year INT NOT NULL,
            Year INT NOT NULL,
            Semester INT NOT NULL,
            Start_date DATE,
            End_date DATE,
            FOREIGN KEY (session_id) REFERENCES Session(session_id)
        );    
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating xml_teacher_data table:', err);
            throw err;
        }
        console.log('ExamYear table created or already exists');
    });
};


/**
 * Retrieves exam year details by exam year ID from the database.
 * @function getExamYearById
 * @param {number} exam_year_id - The ID of the exam year to retrieve.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of exam year objects.
 * @throws Will throw an error if the query fails.
 */
const getExamYearById = (exam_year_id) => {
    // console.log(exam_year_id);
    const query = 'SELECT * FROM ExamYear WHERE exam_year_id = ?';
    
    
    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            // console.log('Query results:', results);
            resolve(results); // Resolve with results (not undefined)
        });
    });
};


/**
 * Retrieves the exam committee associated with a specific exam year from the database.
 * @function getExamCommitteeByExamYearId
 * @param {number} exam_year_id - The ID of the exam year for which to retrieve the exam committee.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of exam committee objects with associated teacher details.
 * @throws Will throw an error if the query fails.
 */
const getExamCommitteeByExamYearId = (exam_year_id) => {
    const query = `
        SELECT ec.*, t.*
        FROM ExamCommittee ec
        JOIN Teacher t ON ec.teacher_id = t.teacher_id
        WHERE ec.exam_year_id = ?
    `;
    
    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            // console.log('Query results for ExamCommittee:', results);
            resolve(results); // Resolve with results (not undefined)
        });
    });
};



module.exports = {
    getExamYearById,
    getExamCommitteeByExamYearId,
    createXmlDataExamYearTable
};
