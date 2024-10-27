
const db = require('../config/db');

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


// Function to fetch exam year details by exam_year_id
const getExamYearById = (exam_year_id) => {
    // console.log('Helllllllllll');
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

// Function to fetch the exam committee by exam_year_id
const getExamCommitteeByExamYearId = (exam_year_id) => {
    // console.log('Hola');
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
