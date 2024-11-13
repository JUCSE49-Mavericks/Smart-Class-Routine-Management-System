const express = require('express');

const {fetchCourseByExamYearId, fetchCourseByCourseId} = require('../controllers/courseController');


const router = express.Router();


router.get('/courses-exam-year/:exam_year_id', fetchCourseByExamYearId);
router.get('/course-details/:course_id', fetchCourseByCourseId);

module.exports = router;