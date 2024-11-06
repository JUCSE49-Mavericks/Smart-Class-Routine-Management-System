// Import the database configuration
const db = require('../config/db');

/**
 * Creates the ExamYear table if it does not already exist.
 * The table stores information about exam years, session details, education levels,
 * and the start and end dates of the exams for each year and semester.
 * It uses a foreign key relationship with the Session table via the session_id.
 *
 * @function createXmlDataExamYearTable
 * @async
 * @returns {void} Does not return anything but logs status or errors to the console.
 * @throws {Error} Throws an error if the table creation query fails.
 *
 * @example
 * // Call the function to ensure the ExamYear table exists
 * createXmlDataExamYearTable();
 *
 * @see {@link ../config/db} for the database configuration.
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

    // Execute the query to create the table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating ExamYear table:', err);
            throw err; // Throw an error to ensure it’s caught by upstream handlers
        }
        console.log('ExamYear table created or already exists');
    });
};

/**
 * @module ExamYearTable
 * @description Module responsible for creating and managing the ExamYear table.
 */
module.exports = {
    createXmlDataExamYearTable
};
