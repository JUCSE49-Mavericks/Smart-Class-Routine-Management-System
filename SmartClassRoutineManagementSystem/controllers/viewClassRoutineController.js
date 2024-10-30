const RoutineService = require('../services/RoutineService');

class ViewClassRoutineController {
    // Fetches the class routine with filters
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
            console.error('Error fetching class routine:', error); // Added error logging
            res.status(500).json({ error: 'Failed to fetch class routine' });
        }
    }

    // Fetches all teachers
    static async getTeachers(req, res) {
        console.log('hello');
        try {
            const teachers = await RoutineService.getAllTeachers();
            res.json(teachers);
        } catch (error) {
            console.error('Error fetching teachers:', error); // Added error logging
            res.status(500).json({ error: 'Failed to fetch teachers' });
        }
    }
    // Fetches all courses
    static async getCourses(req, res) {
        try {
            const courses = await RoutineService.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error('Error fetching courses:', error); // Added error logging
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    // Fetches all routines without filters (if needed)
    static async getRoutines(req, res) {
        try {
            const routines = await RoutineService.getAllRoutines();
            res.json(routines);
        } catch (error) {
            console.error('Error fetching routines:', error); // Added error logging
            res.status(500).json({ error: 'Failed to fetch routines' });
        }
    }
}

module.exports = ViewClassRoutineController;
