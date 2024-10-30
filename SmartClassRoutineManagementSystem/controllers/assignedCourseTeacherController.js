// controllers/assignedCourseTeacherController.js
const {
    updateAssignedCourseTeacher,
    addAssignedCourseTeacherObject,
    getAssignedCourseTeachersByExamYearId
} = require('../models/assignedCourseTeacherModel');

const handleUpdateAssignedCourseTeacher = async (req, res) => {
    const { course_id, teacher_id } = req.body;

    try {
        const result = await updateAssignedCourseTeacher(course_id, teacher_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error handling course-teacher assignment:', error);
        res.status(500).json({ error: 'Database error while assigning course to teacher' });
    }
};


// Controller function to handle assigning or updating course-teacher relationship
const insertAssignedCourseTeacherObject = async (req, res) => {
    // console.log('ola');
    const { course_id , exam_year_id} = req.body;
    try {
        const result = await addAssignedCourseTeacherObject(course_id, exam_year_id);
        res.status(200).json({ message: 'Assigned course-teacher successfully', result });
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Failed to assign or update course-teacher' });
    }
};

// Function to get assigned course teachers by exam_year_id
const getAssignedCourseTeachers = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getAssignedCourseTeachersByExamYearId(exam_year_id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
};

module.exports = {
    handleUpdateAssignedCourseTeacher,
    insertAssignedCourseTeacherObject,
    getAssignedCourseTeachers
};
