const db = require('../config/db')

const createAssignedCourseTeacherTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS AssignedCourseTeacher (
            assigned_course_teacher_id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            teacher_id INT,
            exam_year_id INT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id),
            FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id),
            FOREIGN KEY (exam_year_id) REFERENCES ExamYear(exam_year_id),
            UNIQUE (course_id, teacher_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating AssignedCourseTeacher table:', err);
            throw err;
        }
        console.log('AssignedCourseTeacher table created or already exists');
    });
};


const updateAssignedCourseTeacher = (course_id, teacher_id) => {
    const checkQuery = 'SELECT * FROM AssignedCourseTeacher WHERE course_id = ?';
    const insertQuery = 'INSERT INTO AssignedCourseTeacher (course_id, teacher_id) VALUES (?, ?)';
    const updateQuery = 'UPDATE AssignedCourseTeacher SET teacher_id = ? WHERE course_id = ?';
    
    return new Promise((resolve, reject) => {
        db.query(checkQuery, [course_id], (err, results) => {
            if (err) {
                console.error('Error checking for existing course:', err);
                return reject(err);
            }

            if (results.length > 0) {
                // Course exists, update teacher_id
                db.query(updateQuery, [teacher_id, course_id], (updateErr, updateResults) => {
                    if (updateErr) {
                        console.error('Error updating teacher for course:', updateErr);
                        return reject(updateErr);
                    }
                    resolve({ message: 'Teacher updated for existing course', results: updateResults });
                });
            } else {
                // Course does not exist, insert new row
                db.query(insertQuery, [course_id, teacher_id], (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error('Error inserting new course-teacher assignment:', insertErr);
                        return reject(insertErr);
                    }
                    resolve({ message: 'New course-teacher assignment added', results: insertResults });
                });
            }
        });
    });
};


const addAssignedCourseTeacherObject = (course_id, exam_year_id) => {
    const checkQuery = 'SELECT * FROM AssignedCourseTeacher WHERE course_id = ?';
    const insertQuery = 'INSERT INTO AssignedCourseTeacher (course_id, exam_year_id) VALUES (?, ?)';
    // console.log(course_id);
    // console.log(teacher_id);
    // console.log(exam_year_id);
    return new Promise((resolve, reject) => {
        db.query(checkQuery, [course_id], (err, results) => {
            if (err) {
                console.error('Error checking for existing course:', err);
                return reject(err);
            }

            // If record exists, do nothing and resolve with a message
            if (results.length > 0) {
                return resolve({ message: 'Course-teacher assignment already exists, no action taken.' });
            }

            // Only insert if teacher_id is not null
            
            db.query(insertQuery, [course_id, exam_year_id], (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Error inserting new course-teacher assignment:', insertErr);
                    return reject(insertErr);
                }
                resolve({ message: 'New course-teacher assignment added', results: insertResults });
            });
            
        });
    });
};


// Function to get assigned course teachers by exam_year_id
const getAssignedCourseTeachersByExamYearId = (exam_year_id) => {
    const query = `
        SELECT *
        FROM AssignedCourseTeacher
        WHERE exam_year_id = ?
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


module.exports = {
    createAssignedCourseTeacherTable,
    updateAssignedCourseTeacher,
    addAssignedCourseTeacherObject,
    getAssignedCourseTeachersByExamYearId
}