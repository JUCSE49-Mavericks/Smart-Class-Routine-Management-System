const db = require('../config/db'); // Ensure this path points to your database configuration

/**
 * @module RoutineService
 * @class RoutineService
 * Service for managing and retrieving class routine and course data from the database.
 */
class RoutineService {
    /**
     * Fetch all courses.
     * @async
     * @method getAllCourses
     * @returns {Promise<Array>} List of all courses.
     * @throws {Error} If there is an error in the database query.
     */
    static async getAllCourses() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM courses';
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch all routines from the class_routine table with course and teacher information.
     * @async
     * @method getAllRoutines
     * @returns {Promise<Array>} List of all routines.
     * @throws {Error} If there is an error in the database query.
     */
    static async getAllRoutines() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT class_routine.*, 
                       courses.course_name AS course_name, 
                       teachers.teacher_name AS teacher_name 
                FROM class_routine
                JOIN teachers ON class_routine.teacher_id = teachers.teacher_id
                JOIN courses ON class_routine.course_id = courses.course_id
            `;
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch routines by a specific day.
     * @async
     * @method getRoutinesByDay
     * @param {string} day - The day to filter routines.
     * @returns {Promise<Array>} List of routines for the specified day.
     * @throws {Error} If there is an error in the database query.
     */
    static async getRoutinesByDay(day) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE day = ?';
            db.query(query, [day], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch routines for a specific year.
     * @async
     * @method getRoutinesByYear
     * @param {number} year - The year to filter routines.
     * @returns {Promise<Array>} List of routines for the specified year.
     * @throws {Error} If there is an error in the database query.
     */
    static async getRoutinesByYear(year) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE year = ?';
            db.query(query, [year], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch routines by start time and end time.
     * @async
     * @method getRoutinesByTimeRange
     * @param {string} startTime - The start time for filtering.
     * @param {string} endTime - The end time for filtering.
     * @returns {Promise<Array>} List of routines within the specified time range.
     * @throws {Error} If there is an error in the database query.
     */
    static async getRoutinesByTimeRange(startTime, endTime) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE start_time >= ? AND end_time <= ?';
            db.query(query, [startTime, endTime], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch routines by course type (lab/theory).
     * @async
     * @method getRoutinesByCourseType
     * @param {string} courseType - The course type to filter routines.
     * @returns {Promise<Array>} List of routines for the specified course type.
     * @throws {Error} If there is an error in the database query.
     */
    static async getRoutinesByCourseType(courseType) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT class_routine.* 
                FROM class_routine 
                JOIN courses ON class_routine.course_id = courses.course_id 
                WHERE courses.course_type = ?
            `;
            db.query(query, [courseType], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch routines by room.
     * @async
     * @method getRoutinesByRoom
     * @param {string} room - The room to filter routines.
     * @returns {Promise<Array>} List of routines for the specified room.
     * @throws {Error} If there is an error in the database query.
     */
    static async getRoutinesByRoom(room) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE room = ?';
            db.query(query, [room], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch routines by teacher.
     * @async
     * @method getRoutinesByTeacher
     * @param {string} teacherName - The name of the teacher to filter routines.
     * @returns {Promise<Array>} List of routines for the specified teacher.
     * @throws {Error} If there is an error in the database query.
     */
    static async getRoutinesByTeacher(teacherName) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT class_routine.* 
                FROM class_routine 
                JOIN teachers ON class_routine.teacher_id = teachers.teacher_id 
                WHERE teachers.teacher_name = ?
            `;
            db.query(query, [teacherName], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Fetch all teachers.
     * @async
     * @method getAllTeachers
     * @returns {Promise<Array>} List of all teacher names.
     * @throws {Error} If there is an error in the database query.
     */
    static async getAllTeachers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT teacher_name FROM teachers';
            db.query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllTeachers:', error); // Detailed error logging
                    return reject(error);
                }
                const teachers = results.map(result => result.teacher_name);
                resolve(teachers);
            });
        });
    }

    /**
     * Fetch filtered routines based on multiple criteria.
     * @async
     * @method getFilteredRoutines
     * @param {Object} filters - The filters to apply.
     * @param {string} [filters.day] - The day to filter routines.
     * @param {number} [filters.year] - The year to filter routines.
     * @param {Object} [filters.durationRange] - The duration range for filtering.
     * @param {string} [filters.courseType] - The course type to filter routines.
     * @param {string} [filters.room] - The room to filter routines.
     * @param {string} [filters.teacher] - The teacher to filter routines.
     * @returns {Promise<Array>} List of filtered routines.
     * @throws {Error} If there is an error in the database query.
     */
    static async getFilteredRoutines(filters) {
        return new Promise((resolve, reject) => {
            const { day, year, durationRange, courseType, room, teacher } = filters;

            // Start building the query
            let query = `
                SELECT class_routine.*, 
                       courses.course_name AS course_name, 
                       courses.course_type AS course_type, 
                       teachers.teacher_name AS teacher_name 
                FROM class_routine
                JOIN courses ON class_routine.course_id = courses.course_id
                JOIN teachers ON class_routine.teacher_id = teachers.teacher_id
                WHERE (class_routine.day = ? OR ? IS NULL)
                  AND (class_routine.year = ? OR ? IS NULL)
                  AND (courses.course_type = ? OR ? IS NULL)
                  AND (class_routine.room = ? OR ? IS NULL)
                  AND (teachers.teacher_name = ? OR ? IS NULL)
                  AND (courses.course_name = ? OR ? IS NULL);
            `;

            const queryParams = [];

            // Add filters to the query
            if (day) {
                queryParams.push(day, day);
            } else {
                queryParams.push(null, null);
            }
            if (year) {
                queryParams.push(year, year);
            } else {
                queryParams.push(null, null);
            }
            if (courseType) {
                queryParams.push(courseType, courseType);
            } else {
                queryParams.push(null, null);
            }
            if (room) {
                queryParams.push(room, room);
            } else {
                queryParams.push(null, null);
            }
            if (teacher) {
                queryParams.push(teacher, teacher);
            } else {
                queryParams.push(null, null);
            }

            // Execute the query
            db.query(query, queryParams, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = RoutineService;
