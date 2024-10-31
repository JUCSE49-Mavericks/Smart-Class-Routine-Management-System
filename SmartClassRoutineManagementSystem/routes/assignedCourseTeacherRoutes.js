const express = require('express');
const router = express.Router();

const {
    handleUpdateAssignedCourseTeacher,
    insertAssignedCourseTeacherObject,
    getAssignedCourseTeachers,
    fetchCoursesByExamYearId,
    uploadCSVAssignedCourseTeacher
} = require('../controllers/assignedCourseTeacherController');


router.post('/update-course-teacher', handleUpdateAssignedCourseTeacher);
router.post('/assign-course', insertAssignedCourseTeacherObject);
router.get('/assigned-course-teachers/:exam_year_id', getAssignedCourseTeachers);
router.get('/get-courses-by-exam-year/:exam_year_id', fetchCoursesByExamYearId);
router.post('/upload-csv-assigned-course-teacher', uploadCSVAssignedCourseTeacher);
module.exports = router;