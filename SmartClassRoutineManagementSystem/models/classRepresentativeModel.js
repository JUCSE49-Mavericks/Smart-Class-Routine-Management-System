// models/classRepresentativeModel.js
const db = require('../config/db');

const createClassRepresentativeTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ClassRepresentative (
            cr_id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            exam_year_id INT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES Student(student_id),
            FOREIGN KEY (exam_year_id) REFERENCES ExamYear(exam_year_id)
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
