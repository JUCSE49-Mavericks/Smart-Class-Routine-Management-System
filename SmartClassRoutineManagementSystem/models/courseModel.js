const db = require('../config/db');

const getCourseByExamYearId = (exam_year_id) => {
    // console.log('Helllllllllll');
    // console.log('Kam hoise');
    // console.log(exam_year_id);
    const query = 'SELECT * FROM Course WHERE exam_year_id = ?';
    
    
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

const getCourseByCourseId = (course_id) => {
    // console.log('Helllllllllll');
    // console.log('Kam hoise');
    // console.log(exam_year_id);
    const query = 'SELECT * FROM Course WHERE course_id = ?';
    
    
    return new Promise((resolve, reject) => {
        db.query(query, [course_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            console.log('Query results:', results);
            resolve(results); // Resolve with results (not undefined)
        });
    });
};

module.exports = {
    getCourseByExamYearId,
    getCourseByCourseId
};