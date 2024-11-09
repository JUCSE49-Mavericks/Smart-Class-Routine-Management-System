const express = require('express');
const router = express.Router();
const MakeupScheduleController = require('./controllers/makeuproutinegeneratorcontroller.js');


// Route to create the Makeup_Schedule table
router.get('/create-table', MakeupScheduleController.createTable);

// Route to add a new schedule entry
router.post('/add-entry', MakeupScheduleController.addEntry);

module.exports = router;
