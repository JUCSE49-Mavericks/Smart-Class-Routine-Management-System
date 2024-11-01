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


const getTeachersByExamYearId = (exam_year_id) => {
    // console.log('holla');
    const query = `
      SELECT t.teacher_id, t.Name, t.Designation, t.Email, t.Phone, t.Abvr, d.Dept_Name
      FROM Teacher t
      JOIN Department d ON t.dept_id = d.dept_id
      JOIN Session s ON s.dept_id = d.dept_id
      JOIN ExamYear e ON e.session_id = s.session_id
      WHERE e.exam_year_id = ?;
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


// Function to insert or update the ExamCommittee
const insertOrUpdateExamCommittee = (exam_year_id, teacher_id) => {
    const selectQuery = `
        SELECT * FROM ExamCommittee WHERE exam_year_id = ?;
    `;
    const insertQuery = `
        INSERT INTO ExamCommittee (exam_year_id, teacher_id) VALUES (?, ?);
    `;
    const updateQuery = `
        UPDATE ExamCommittee SET teacher_id = ? WHERE exam_year_id = ?;
    `;

    return new Promise((resolve, reject) => {
        // First, check if a record with the given exam_year_id already exists
        db.query(selectQuery, [exam_year_id], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                // If no row found, perform an INSERT
                db.query(insertQuery, [exam_year_id, teacher_id], (insertErr, insertResults) => {
                    if (insertErr) {
                        return reject(insertErr);
                    }
                    resolve({ message: 'Inserted new exam committee', insertResults });
                });
            } else {
                // If row found, perform an UPDATE
                db.query(updateQuery, [teacher_id, exam_year_id], (updateErr, updateResults) => {
                    if (updateErr) {
                        return reject(updateErr);
                    }
                    resolve({ message: 'Updated existing exam committee', updateResults });
                });
            }
        });
    });
};



module.exports = {
    createExamCommitteeTable,
    getTeachersByExamYearId,
    insertOrUpdateExamCommittee
}