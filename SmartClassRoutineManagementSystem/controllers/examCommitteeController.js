const db = require('../config/db');

const { createXmlDataStudentTable, getTeachersByExamYearId, insertOrUpdateExamCommittee } = require('../models/examCommitteeModel');

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