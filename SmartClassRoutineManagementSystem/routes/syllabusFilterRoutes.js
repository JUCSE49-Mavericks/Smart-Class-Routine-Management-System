const express = require('express');
const CourseDataFetcher = require('../controllers/syllabusFilterController');
const pool = require('../config/db');  // Database connection pool
const router = express.Router();
// const port=5010;
const courseDataFetcher = new CourseDataFetcher(pool);


/**
 * Route to fetch course details based on selected filters
 * @route POST /fetch-course-details
 * @param {string} req.body.departmentName - The name of the department to filter courses
 * @param {string} req.body.sessionName - The session (e.g., Spring 2024) to filter courses
 * @param {string} req.body.examYear - The exam year to filter courses
 * @param {string} req.body.courseName - The specific course name to filter (if any)
 * @returns {object} 200 - JSON object with the course data
 * @returns {Error} 500 - Error message in case of failure
 */
router.post('/fetch-course-details', (req, res) => {
    const { departmentName, sessionName, examYear, courseName } = req.body;

    courseDataFetcher.fetchCourseData(departmentName, sessionName, examYear, courseName, (err, courseData) => {
        if (err) {
            console.error('Error fetching course details:', err);
            return res.status(500).send('Error fetching course details');
        }

        res.json(courseData);
    });
});

module.exports = router;
