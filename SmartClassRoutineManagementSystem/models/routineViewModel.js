// src/models/routineViewModel.js
const db = require('../config/db'); // Import your database connection

class RoutineViewModel {
    // Fetch all routines by filter criteria
    async getRoutines(filters) {
        let query = `
            SELECT ClassRoutine.id, ClassRoutine.day, ClassRoutine.year, ClassRoutine.time_slot, 
                   ClassRoutine.additional_time_slot, Teacher.name AS teacher, Course.name AS course, 
                   ClassRoutine.room
            FROM ClassRoutine
            JOIN teachertable AS Teacher ON ClassRoutine.teacher_id = Teacher.id
            JOIN coursetable AS Course ON ClassRoutine.course_id = Course.id
            WHERE 1=1
        `;

        const params = [];

        // Apply filters based on viewMode
        if (filters.date) {
            query += ' AND ClassRoutine.day = ?';
            params.push(filters.date);
        }

        if (filters.dateRange) {
            query += ' AND ClassRoutine.day BETWEEN ? AND ?';
            params.push(filters.dateRange.start, filters.dateRange.end);
        }

        if (filters.timeRange) {
            query += ' AND ClassRoutine.time_slot BETWEEN ? AND ?';
            params.push(filters.timeRange.start, filters.timeRange.end);
        }

        if (filters.department) {
            query += ' AND ClassRoutine.departmentId = ?';
            params.push(filters.department);
        }

        if (filters.batch) {
            query += ' AND Batch.name = ?';
            params.push(filters.batch);
        }

        if (filters.teacher) {
            query += ' AND Teacher.name LIKE ?';
            params.push(`%${filters.teacher}%`);
        }

        if (filters.courseType) {
            query += ` AND Course.type = ?`;
            params.push(filters.courseType);
        }

        // Execute the query
        const [results] = await db.execute(query, params);
        return results;
    }
}

module.exports = new RoutineViewModel();
