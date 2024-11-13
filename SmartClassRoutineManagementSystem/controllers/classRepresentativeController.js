/**
 * @module controllers/classRepresentativeController
 */
const { getClassRepresentativeByExamYearId } = require('../models/classRepresentativeModel');



/**
 * Fetches class representatives for a specific exam year, based on `exam_year_id`.
 * Responds with a JSON object containing the results if successful, or an error message if not.
 * @async
 * @function fetchClassRepresentativeByExamYearId
 * @param {Object} req - Express request object, containing `exam_year_id` as a URL parameter.
 * @param {Object} res - Express response object used to send the response.
 * @returns {Promise<void>} - Sends a JSON response with the class representative data or an error message.
 * @throws Will send a 500 status code response if a database error occurs, or a 404 if no representative is found.
 */
const fetchClassRepresentativeByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getClassRepresentativeByExamYearId(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Class Representative not found' });
        }

        // console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error fetching class representative data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    fetchClassRepresentativeByExamYearId
};
