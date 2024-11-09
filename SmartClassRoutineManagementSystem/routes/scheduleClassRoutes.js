// routes/scheduledClassRoutes.js
const express = require('express');
const router = express.Router();
const { fetchScheduledClasses } = require('../controllers/scheduleClassController');

// Route to fetch all scheduled classes for a specific teacher
router.get('/scheduled-classes/:teacher_id', fetchScheduledClasses);

module.exports = router;
