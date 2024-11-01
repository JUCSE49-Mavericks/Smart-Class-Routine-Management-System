// models/examYearModel.js

const db = require('../config/db');

/**
 * Creates the ExamYear table in the database if it does not already exist.
 * The ExamYear table stores information about exam years associated with specific sessions and education levels.
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
            console.error('Error creating ExamYear table:', err);
            throw err; // Rethrow the error for further handling if necessary
        }
        console.log('ExamYear table created or already exists');
    });
};

module.exports = {
    createXmlDataExamYearTable
};
