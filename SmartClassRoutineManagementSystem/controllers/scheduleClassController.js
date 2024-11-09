// controllers/scheduledClassController.js
const { getScheduledClassesByTeacherId } = require('../models/scheduledClassModel');

const fetchScheduledClasses = (req, res) => {
    const teacherId = req.params.teacher_id;

    getScheduledClassesByTeacherId(teacherId, (error, classes) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch scheduled classes', error });
        }
        res.status(200).json(classes);
    });
};

module.exports = {
    fetchScheduledClasses
}