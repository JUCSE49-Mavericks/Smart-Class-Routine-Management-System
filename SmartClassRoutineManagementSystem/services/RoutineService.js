const db = require('../config/db'); // Ensure this path points to your database configuration

class RoutineService {

    // Fetch all courses
    static async getAllCourses() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM courses';
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Fetch all routines from the class_routine table with course and teacher information
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

    // Fetch routines by a specific day
    static async getRoutinesByDay(day) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE day = ?';
            db.query(query, [day], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Fetch routines for a specific year
    static async getRoutinesByYear(year) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE year = ?';
            db.query(query, [year], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Fetch routines by start time and end time
    static async getRoutinesByTimeRange(startTime, endTime) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE start_time >= ? AND end_time <= ?';
            db.query(query, [startTime, endTime], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Fetch routines by course type (lab/theory)
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

    // Fetch routines by room
    static async getRoutinesByRoom(room) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM class_routine WHERE room = ?';
            db.query(query, [room], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Fetch routines by teacher
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

    // Fetch all teachers
    static async getAllTeachers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT teacher_name FROM teachers';
            db.query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllTeachers:', error); // Add detailed error logging
                    return reject(error);
                }
                const teachers = results.map(result => result.teacher_name);
                resolve(teachers);
            });
        });
    }

    // Fetch filtered routines based on multiple criteria
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
            if (durationRange) {
                const { start, end } = durationRange; // Assume durationRange is an object with start and end properties
                query += ' AND class_routine.start_time >= ? AND class_routine.end_time <= ?';
                queryParams.push(start, end);
            }

            db.query(query, queryParams, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = RoutineService;
