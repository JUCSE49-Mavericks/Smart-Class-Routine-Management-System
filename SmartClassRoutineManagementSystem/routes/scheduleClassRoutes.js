// routes/scheduledClassRoutes.js
const express = require('express');
const router = express.Router();
const { 
    fetchScheduledClasses,
    confirmScheduledClass,
    cancelScheduledClass,
    setClassNotConfirmed,
    rescheduleScheduledClass,
    fetchTimeSlots
} = require('../controllers/scheduleClassController');

// Route to fetch all scheduled classes for a specific teacher
router.get('/scheduled-classes/:teacher_id', fetchScheduledClasses);

// Route to confirm a scheduled class
router.post('/confirm-class/:scheduled_class_id', confirmScheduledClass);

// Route to cancel a scheduled class
router.post('/cancel-class/:scheduled_class_id', cancelScheduledClass);

// Route to set a confirmed class to scheduled
router.post('/set-not-confirmed/:scheduled_class_id', setClassNotConfirmed);

// Route to fetch time slots
router.get('/time-slots', fetchTimeSlots);

// Route to reschedule a class
router.post('/reschedule-class/:scheduled_class_id', rescheduleScheduledClass);
module.exports = router;
