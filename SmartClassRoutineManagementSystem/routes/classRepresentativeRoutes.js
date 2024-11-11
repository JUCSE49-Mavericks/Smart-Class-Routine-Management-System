//routes/classRepresentativeRoutes

const express = require('express');
const { fetchClassRepresentativeByExamYearId } = require('../controllers/classRepresentativeController');

const { fetchStudentsByExamYearId, updateClassRepresentativeInfo } = require('../controllers/updateClassRepresentativeController')

const router = express.Router();

router.get('/class-representative/:exam_year_id', fetchClassRepresentativeByExamYearId);

router.get('/students-by-exam-year-id/:exam_year_id', fetchStudentsByExamYearId);

// Endpoint to update class representative
router.put('/update-class-representative', updateClassRepresentativeInfo);

module.exports = router;