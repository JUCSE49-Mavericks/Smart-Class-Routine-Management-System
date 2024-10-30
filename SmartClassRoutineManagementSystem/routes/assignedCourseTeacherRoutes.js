const express = require('express');
const router = express.Router();

const {
    handleUpdateAssignedCourseTeacher,
    insertAssignedCourseTeacherObject,
    getAssignedCourseTeachers
} = require('../controllers/assignedCourseTeacherController');


router.post('/update-course-teacher', handleUpdateAssignedCourseTeacher);
router.post('/assign-course', insertAssignedCourseTeacherObject);
router.get('/assigned-course-teachers/:exam_year_id', getAssignedCourseTeachers);

module.exports = router;