/**
 * @module controllers/assignedCourseTeacherController
 */
const {
    updateAssignedCourseTeacher,
    addAssignedCourseTeacherObject,
    getAssignedCourseTeachersByExamYearId,
    getCoursesByExamYearId,
    uploadCSVAssignedCourseTeacherModel
} = require('../models/assignedCourseTeacherModel');


/**
 * Updates the assigned course teacher based on provided IDs.
 * @async
 * @function handleUpdateAssignedCourseTeacher
 * @param {Object} req - Express request object containing `assigned_course_teacher_id` and `teacher_id` in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with success message or error details.
 */
const handleUpdateAssignedCourseTeacher = async (req, res) => {
    const { assigned_course_teacher_id, teacher_id } = req.body;

    try {
        const result = await updateAssignedCourseTeacher(assigned_course_teacher_id, teacher_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error handling course-teacher assignment:', error);
        res.status(500).json({ error: 'Database error while assigning course to teacher' });
    }
};


/**
 * Inserts or updates a course-teacher assignment.
 * @async
 * @function insertAssignedCourseTeacherObject
 * @param {Object} req - Express request object containing `course_id` and `exam_year_id` in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with success message or error details.
 */
const insertAssignedCourseTeacherObject = async (req, res) => {

    const { course_id , exam_year_id} = req.body;
    try {
        const result = await addAssignedCourseTeacherObject(course_id, exam_year_id);
        res.status(200).json({ message: 'Assigned course-teacher successfully', result });
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Failed to assign or update course-teacher' });
    }
};

/**
 * Retrieves assigned course teachers by `exam_year_id`.
 * @async
 * @function getAssignedCourseTeachers
 * @param {Object} req - Express request object containing `exam_year_id` as a URL parameter.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with a list of assigned course teachers or error details.
 */
const getAssignedCourseTeachers = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getAssignedCourseTeachersByExamYearId(exam_year_id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
};

/**
 * Fetches courses assigned to teachers by `exam_year_id`.
 * @async
 * @function fetchCoursesByExamYearId
 * @param {Object} req - Express request object containing `exam_year_id` as a URL parameter.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with a list of courses or error details.
 */
const fetchCoursesByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;
    // console.log(exam_year_id);
    try {
        const results = await getCoursesByExamYearId(exam_year_id);
        // console.log(results);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
};


/**
 * Handles CSV data upload, processes it for bulk course-teacher assignments, and sends the response.
 * @async
 * @function uploadCSVAssignedCourseTeacher
 * @param {Object} req - Express request object containing `csvData` in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Sends JSON response with a success message or error details.
 */
const uploadCSVAssignedCourseTeacher = async (req, res) => {
    const csvData = req.body.csvData; // Assume this is an array of objects representing CSV rows
    console.log(csvData);
    try {
        const promises = csvData.map(({ course_id, teacher_id }) => 
            uploadCSVAssignedCourseTeacherModel(course_id, teacher_id)
        );

        const results = await Promise.all(promises);
        res.status(200).json({ message: 'All records processed successfully', results });
    } catch (error) {
        console.error('Error processing records:', error);
        res.status(500).json({ message: 'Error processing records' });
    }
};



module.exports = {
    handleUpdateAssignedCourseTeacher,
    insertAssignedCourseTeacherObject,
    getAssignedCourseTeachers,
    fetchCoursesByExamYearId,
    uploadCSVAssignedCourseTeacher,
    // processCSVData
};
