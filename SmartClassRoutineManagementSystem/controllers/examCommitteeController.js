//controllers/examCommitteeController.js

/**
 * @module examCommitteeController
 */

const db = require('../config/db');

const { createXmlDataStudentTable, getTeachersByExamYearId, insertOrUpdateExamCommittee } = require('../models/examCommitteeModel');


/**
 * Retrieves teachers associated with a specific exam year.
 * 
 * @function getTeachersByExamYear
 * @async
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves when the data is sent successfully.
 */
const getTeachersByExamYear = async (req, res) => {
    const { exam_year_id } = req.params;

    try {
        const teachers = await getTeachersByExamYearId(exam_year_id);

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: 'No teachers found for the given exam year ID.' });
        }

        res.status(200).json({ teachers });
    } catch (error) {
        console.error("Error fetching teachers by exam_year_id:", error);
        res.status(500).json({ error: 'Failed to fetch teachers.' });
    }
};


/**
 * Inserts or updates an exam committee record.
 * 
 * @function insertOrUpdateExamCommitteeController
 * @async
 * @param {Object} req - The request object containing the exam year ID and teacher ID.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves when the operation is completed.
 */
const insertOrUpdateExamCommitteeController = async (req, res) => {
    const { exam_year_id, teacher_id } = req.body;

    try {
        const result = await insertOrUpdateExamCommittee(exam_year_id, teacher_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error inserting/updating exam committee', details: error });
    }
};

module.exports = {
    getTeachersByExamYear,
    insertOrUpdateExamCommitteeController
}