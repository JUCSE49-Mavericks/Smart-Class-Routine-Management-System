const express = require('express');
const router = express.Router();
const viewClassRoutineController = require('../controllers/viewClassRoutineController')
// const viewClassRoutineController = require('../controllers/viewClassRoutineController'); // Ensure the path is correct

// Log the controller to check if it's imported correctly
// console.log(viewClassRoutineController); // This should log the instance of your controller

// Define your routes
router.get('/class-routine', viewClassRoutineController.getClassRoutine);
router.get('/teachers', viewClassRoutineController.getTeachers);  // Controller should have a getTeachers function
router.get('/courses', viewClassRoutineController.getCourses);    // Add route for fetching courses
//router.get('/rooms',viewClassRoutineController.getRooms);
router.get('/', viewClassRoutineController.getRoutines); // Handles general /api/routines endpoint with viewMode

module.exports = router;
