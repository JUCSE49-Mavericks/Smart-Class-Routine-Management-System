const express = require('express');
const cors = require('cors');
const RoutineInputProcessor = require('../../controllers/ROUTINE/routineInputProcessorController');
const DataProcessController = require('../../controllers/ROUTINE/routineDataProcessController');
const RoutineGenerateController = require('../../controllers/ROUTINE/routineGeneratorController');

const app = express();
const port = 5001;

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Route to handle schedule generation
app.post('/api/generate-schedule', async (req, res) => {
    const { department, slotCount, slotDuration, startTime, endTime, lunchDuration, lunchTime } = req.body;

    try {
        // Step 1: Process initial schedule input with RoutineInputProcessor
        const routineInputProcessor = new RoutineInputProcessor();
        const initialResponse = await routineInputProcessor.processSchedule(req.body);
        console.log("Initial schedule processed by RoutineInputProcessor");

        // Step 2: Process department-specific data with DataProcessController
        const dataProcessController = new DataProcessController();
        const processedData = await dataProcessController.processDepartmentData(department);
        console.log("Department-specific data processed by DataProcessController");

        // Step 3: Generate final response with RoutineGenerateController
        const routineGenerateController = new RoutineGenerateController();
        const finalResponse = await routineGenerateController.generateFinalResponse(initialResponse, processedData);
       
      // Include logged details in the response
      res.status(200).json({
        message: 'Schedule generated successfully',
        data: finalResponse,
    });
    } catch (error) {
        console.error('Error generating schedule:', error);
        res.status(500).json({ message: 'Server error while generating schedule', error });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
