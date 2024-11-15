const db = require('../config/db');

/**
 * Creates the makeupschedule table if it doesn't already exist.
 * @function
 */
const createMakeupScheduleTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS makeupschedule (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_name VARCHAR(255) NOT NULL,
            course_type ENUM('Lab', 'Theory') NOT NULL,
            teacher_name VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            classes_performed INT DEFAULT 0,
            threshold_classes INT NOT NULL
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating makeupschedule table:', err);
            throw err;
        }
        console.log('makeupschedule table created or already exists');
    });
};

/**
 * Inserts a new schedule entry into the makeupschedule table.
 * @function
 * @param {Object} entry - The schedule entry to insert.
 * @returns {Promise<number>} A promise that resolves to the inserted entry ID.
 */
const insertEntry = (entry) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO makeupschedule (
                course_name, course_type, teacher_name, year, classes_performed, threshold_classes
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            entry.course_name, entry.course_type, entry.teacher_name,
            entry.year, entry.classes_performed || 0, entry.threshold_classes
        ];
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting entry:', err);
                reject(err);
            } else {
                resolve(result.insertId);
            }
        });
    });
};

/**
 * Retrieves the number of classes needed for a course.
 * @function
 * @param {string} courseName - The name of the course.
 * @returns {Promise<number>} A promise that resolves to the number of classes needed.
 */
const getClassesNeeded = (courseName) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT threshold_classes, classes_performed
            FROM makeupschedule
            WHERE course_name = ?
        `;
        db.query(query, [courseName], (err, results) => {
            if (err) {
                console.error('Error fetching class counts:', err);
                reject(err);
            } else if (results.length === 0) {
                reject(new Error('Course not found'));
            } else {
                const { threshold_classes, classes_performed } = results[0];
                
                // If valid numbers for threshold_classes and classes_performed are found, calculate the classes needed
                const classesNeeded = Math.max(threshold_classes - classes_performed, 0);
                
                // Resolve the promise with the number of makeup classes needed
                resolve(classesNeeded);
            }
        });
    });
};

/**
 * Retrieves the course type for a specific course name.
 * @function
 * @param {string} courseName - The name of the course.
 * @returns {Promise<string>} A promise that resolves to the course type ('Lab' or 'Theory').
 */
const getCourseTypeByCourseName = (courseName) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT course_type
            FROM makeupschedule
            WHERE course_name = ?
            LIMIT 1
        `;
        db.query(query, [courseName], (err, results) => {
            if (err) {
                console.error('Error fetching course type by course name:', err);
                reject(err);
            } else if (results.length === 0) {
                reject(new Error('Course not found'));
            } else {
                resolve(results[0].course_type);
            }
        });
    });
};

module.exports = {
    createMakeupScheduleTable,
    insertEntry,
    getClassesNeeded,
    getCourseTypeByCourseName
};
