const express = require('express');
const { fetchClassRepresentativeByExamYearId } = require('../controllers/classRepresentativeController');

const router = express.Router();

router.get('/class-representative/:exam_year_id', fetchClassRepresentativeByExamYearId);

module.exports = router;