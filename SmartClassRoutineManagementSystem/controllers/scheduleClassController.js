// controllers/scheduledClassController.js
const { 
    getScheduledClassesByTeacherId,
    updateStatusToConducted,
    confirmClass,
    cancelClass,
    setNotConfirmed,
    getTimeSlots
} = require('../models/scheduledClassModel');

const { rescheduleClass } = require('../models/scheduledClassModel');

/**
 * Controller to fetch scheduled classes by teacher ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const fetchScheduledClasses = (req, res) => {
    const teacherId = req.params.teacher_id;

    // Update statuses before fetching
    updateStatusToConducted((error) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to update class statuses', error });
        }

        // Fetch scheduled classes after status update
        getScheduledClassesByTeacherId(teacherId, (error, classes) => {
            if (error) {
                return res.status(500).json({ message: 'Failed to fetch scheduled classes', error });
            }
            res.status(200).json(classes);
        });
    });
};

/**
 * Controller to confirm a scheduled class
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const confirmScheduledClass = (req, res) => {
    const { scheduled_class_id } = req.params;

    confirmClass(scheduled_class_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to confirm class', error });
        }
        
        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No class found to confirm' });
        }

        res.status(200).json({ message: 'Class confirmed successfully' });
    });
};

/**
 * Controller to cancel a scheduled class
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const cancelScheduledClass = (req, res) => {
    const { scheduled_class_id } = req.params;

    cancelClass(scheduled_class_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to cancel class', error });
        }
        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No class found to confirm' });
        }

        res.status(200).json({ message: 'Class canceled successfully' });
    });
};

/**
 * Controller to set a class status to 'Scheduled' from 'Confirmed'
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const setClassNotConfirmed = (req, res) => {
    const { scheduled_class_id } = req.params;

    setNotConfirmed(scheduled_class_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to set class as not confirmed', error });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No class found to confirm' });
        }

        res.status(200).json({ message: 'Class status set to Scheduled' });
    });
};

/**
 * Controller to fetch all available time slots
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const fetchTimeSlots = (req, res) => {
    getTimeSlots((error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch time slots', error });
        }

        // Check if the results array is empty
        if (results.length === 0) {
            return res.status(404).json({ message: 'No time slot found' });
        }

        res.status(200).json(results);
    });
};

/**
 * Controller to reschedule a class
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const rescheduleScheduledClass = (req, res) => {
    const { scheduled_class_id } = req.params;
    const { new_date, new_time_slot_id } = req.body;

    rescheduleClass(scheduled_class_id, new_date, new_time_slot_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to reschedule class', error });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No class found to confirm' });
        }

        res.status(200).json({ message: 'Class rescheduled successfully' });
    });
};

module.exports = {
    fetchScheduledClasses,
    confirmScheduledClass,
    cancelScheduledClass,
    setClassNotConfirmed,
    fetchTimeSlots,
    rescheduleScheduledClass
};
