
/**
 * @module models/courseModel
 */

const db = require('../config/db');

/**
 * Retrieves all courses for a specified exam year from the database.
 * @function getCourseByExamYearId
 * @param {number} exam_year_id - The ID of the exam year to retrieve courses for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of course objects.
 * @throws Will throw an error if the query fails.
 */
const getCourseByExamYearId = (exam_year_id) => {
    // console.log(exam_year_id);
    const query = 'SELECT * FROM Course WHERE exam_year_id = ?';
    
    
    return new Promise((resolve, reject) => {
        db.query(query, [exam_year_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            // console.log('Query Course data results:', results);
            resolve(results); // Resolve with results (not undefined)
        });
    });
};

/**
 * Retrieves a specific course by its course ID from the database.
 * @function getCourseByCourseId
 * @param {number} course_id - The ID of the course to retrieve.
 * @returns {Promise<Object[]>} - A promise that resolves to an array with the course object, or an empty array if not found.
 * @throws Will throw an error if the query fails.
 */
const getCourseByCourseId = (course_id) => {
    
    // console.log(exam_year_id);
    const query = 'SELECT * FROM Course WHERE course_id = ?';
    
    
    return new Promise((resolve, reject) => {
        db.query(query, [course_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }
            // console.log('Course results:', results);
            resolve(results); // Resolve with results (not undefined)
        });
    });
};

module.exports = {
    getCourseByExamYearId,
    getCourseByCourseId
};