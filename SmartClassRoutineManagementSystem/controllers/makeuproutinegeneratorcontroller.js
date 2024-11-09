// controllers/makeupScheduleController.js
const MakeupScheduleModel = require('../models/makeupclassRoutineModel');
const { exec } = require('child_process');

/**
 * Generates a makeup class schedule by calling the genetic algorithm in Python.
 * @param {string} courseName - The name of the course.
 */
const generateMakeupSchedule = async (courseName) => {
    try {
        // Fetch the classes needed for this course from the database
        const classesNeeded = await MakeupScheduleModel.getClassesNeeded(courseName);

        // Ensure that classes are needed
        if (classesNeeded === 0) {
            throw new Error(`No makeup classes needed for course: ${courseName}`);
        }

        return new Promise((resolve, reject) => {
            const command = `python3 makeup_schedule_generator.py ${classesNeeded}`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing Python script: ${error.message}`);
                    return reject(error);
                }
                if (stderr) {
                    console.error(`Python script error: ${stderr}`);
                    return reject(stderr);
                }

                try {
                    const schedule = JSON.parse(stdout.trim());
                    resolve(schedule);
                } catch (parseError) {
                    reject(parseError);
                }
            });
        });
    } catch (error) {
        throw new Error(`Failed to generate schedule: ${error.message}`);
    }
};

// Example Express route handler
const express = require('express');
const router = express.Router();

router.get('/generate-makeup-schedule', async (req, res) => {
    const courseName = req.query.courseName;

    if (!courseName) {
        return res.status(400).json({ error: "Missing 'courseName' parameter" });
    }

    try {
        const schedule = await generateMakeupSchedule(courseName);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
