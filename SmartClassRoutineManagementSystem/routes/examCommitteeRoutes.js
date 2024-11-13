const express = require('express');
const router = express.Router();

const {
    getTeachersByExamYear,
    insertOrUpdateExamCommitteeController
} = require('../controllers/examCommitteeController')


router.get('/teacher-by-exam-year/:exam_year_id',getTeachersByExamYear);
router.post('/update-exam-committee', insertOrUpdateExamCommitteeController);

module.exports = router;