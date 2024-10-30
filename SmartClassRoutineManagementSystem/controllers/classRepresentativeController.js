// controllers/classRepresentativeController.js

/**
 * Controller for fetching class representative data based on exam year ID.
 * @module classRepresentativeController
 */

const { getClassRepresentativeByExamYearId } = require('../models/classRepresentativeModel');

/**
 * Fetches the class representative by a given exam year ID.
 * Sends the representative data as a JSON response if found, otherwise sends a 404 error.
 * @async
 * @function fetchClassRepresentativeByExamYearId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with JSON data for the class representative or an error message.
 * @throws {Error} Database error if there's an issue fetching the data.
 */

const fetchClassRepresentativeByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getClassRepresentativeByExamYearId(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Class Representative not found' });
        }

        console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error fetching class representative data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    fetchClassRepresentativeByExamYearId
};
