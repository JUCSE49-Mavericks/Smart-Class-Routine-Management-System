const db = require('../config/db');

const createExamCommitteeTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ExamCommittee (
            exam_committee_id INT AUTO_INCREMENT PRIMARY KEY,
            exam_year_id INT NOT NULL,
            teacher_id INT NOT NULL,
            FOREIGN KEY (exam_year_id) REFERENCES ExamYear(exam_year_id),
            FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id),
            UNIQUE (exam_year_id, teacher_id)
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