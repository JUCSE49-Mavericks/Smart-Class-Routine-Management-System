const db = require('../config/db');

const createExamCommitteeTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ExamCommittee (
            exam_committee_id INT AUTO_INCREMENT PRIMARY KEY,
            teacher_id INT NOT NULL,
            exam_year_id INT NOT NULL,
            FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id),
            FOREIGN KEY (exam_year_id) REFERENCES ExamYear(exam_year_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating ExamCommittee table:', err);
            throw err;
        }
        console.log('ExamCommittee table created or already exists');
    });
};


module.exports = {
    createExamCommitteeTable
}