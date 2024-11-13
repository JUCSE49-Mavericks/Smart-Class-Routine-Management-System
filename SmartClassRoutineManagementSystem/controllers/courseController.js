/**
 * @module controllers/courseController
 */

const db = require('../config/db');
const {getCourseByExamYearId, getCourseByCourseId} = require('../models/courseModel');

/**
 * Fetches courses associated with a specific exam year ID and sends the results as a JSON response.
 * @function fetchCourseByExamYearId
 * @param {Object} req - The request object containing the exam year ID in the URL parameters.
 * @param {Object} res - The response object used to send the results back to the client.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
const fetchCourseByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;
    try {
        const results = await getCourseByExamYearId(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching Course data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};

/**
 * Fetches a course by its ID and sends the results as a JSON response.
 * @function fetchCourseByCourseId
 * @param {Object} req - The request object containing the course ID in the URL parameters.
 * @param {Object} res - The response object used to send the results back to the client.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
const fetchCourseByCourseId = async (req, res) => {
    const course_id = req.params.course_id;

    try {
        const results = await getCourseByCourseId(course_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error fetching Course data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    fetchCourseByExamYearId,
    fetchCourseByCourseId
}