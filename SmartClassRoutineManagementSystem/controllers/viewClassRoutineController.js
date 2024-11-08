const RoutineService = require('../models/routineViewModel');

class ViewClassRoutineController {
    /**
     * Fetches the class routine with filters.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {string} req.query.day - The day of the week for the routine.
     * @param {string} req.query.year - The academic year of the routine.
     * @param {Object} req.query.durationRange - The time range for filtering.
     * @param {string} req.query.courseType - The type of course (e.g., Lab or Theory).
     * @param {string} req.query.room - The room number for the routine.
     * @param {string} req.query.teacher - The name of the teacher for filtering.
     * @returns {Promise<void>} A promise that resolves when the response is sent.
     * @throws {Error} Throws an error if the routine fetch fails.
     */
    static async getClassRoutine(req, res) {
        const { day, year, durationRange, courseType, room, teacher } = req.query;

        try {
            const routines = await RoutineService.getFilteredRoutines({
                day,
                year,
                durationRange,
                courseType,
                room,
                teacher,
            });
            res.json(routines);
        } catch (error) {
            console.error('Error fetching class routine:', error); // Error logging
            res.status(500).json({ error: 'Failed to fetch class routine' });
        }
    }

    /**
     * Fetches all teachers.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A promise that resolves when the response is sent.
     * @throws {Error} Throws an error if the fetch fails.
     */
    static async getTeachers(req, res) {
        try {
            const teachers = await RoutineService.getAllTeachers();
            res.json(teachers);
        } catch (error) {
            console.error('Error fetching teachers:', error); // Error logging
            res.status(500).json({ error: 'Failed to fetch teachers' });
        }
    }

    /**
     * Fetches all courses.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A promise that resolves when the response is sent.
     * @throws {Error} Throws an error if the fetch fails.
     */
    static async getCourses(req, res) {
        try {
            const courses = await RoutineService.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error('Error fetching courses:', error); // Error logging
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    /**
     * Fetches all routines without filters (if needed).
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A promise that resolves when the response is sent.
     * @throws {Error} Throws an error if the fetch fails.
     */
    static async getRoutines(req, res) {
        try {
            const routines = await RoutineService.getAllRoutines();
            res.json(routines);
        } catch (error) {
            console.error('Error fetching routines:', error); // Error logging
            res.status(500).json({ error: 'Failed to fetch routines' });
        }
    }
}

module.exports = ViewClassRoutineController;
