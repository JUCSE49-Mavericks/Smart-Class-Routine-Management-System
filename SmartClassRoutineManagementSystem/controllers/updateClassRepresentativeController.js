// controllers/updateClassRepresentativeController.js

const {
    getStudentsByExamYear,
    updateClassRepresentative
} = require('../models/updateClassRepresentativeModel');

/**
 * Fetch students by their exam year ID.
 * 
 * This function retrieves the list of students for the given exam year ID.
 * It sends a JSON response with the student data or an error message if no students are found.
 * 
 * @param {Object} req - The request object containing the exam_year_id parameter.
 * @param {Object} res - The response object to send the result or error.
 * @returns {void}
 */

const fetchStudentsByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const students = await getStudentsByExamYear(exam_year_id);

        if (students.length === 0) {
            return res.status(404).json({ error: 'No students found for the specified exam year' });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Database error' });
    }
};


/**
 * Update the class representative information for a given exam year.
 * 
 * This function updates or inserts a class representative based on the given exam year, student ID, and role.
 * It responds with a success or error message based on the outcome of the database operation.
 * 
 * @param {Object} req - The request object containing the exam_year_id, student_id, and role in the body.
 * @param {Object} res - The response object to send the result or error.
 * @returns {void}
 */

const updateClassRepresentativeInfo = async (req, res) => {
    const { exam_year_id, student_id, role } = req.body;

    if (!exam_year_id || !student_id || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await updateClassRepresentative(exam_year_id, student_id, role);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Class representative updated successfully' });
        } else {
            return res.status(404).json({ error: 'Class representative not found for the given exam_year_id' });
        }
    } catch (error) {
        console.error('Error updating class representative:', error);
        res.status(500).json({ error: 'Database error' });
    }
};


module.exports = {
    fetchStudentsByExamYearId,
    updateClassRepresentativeInfo
};
