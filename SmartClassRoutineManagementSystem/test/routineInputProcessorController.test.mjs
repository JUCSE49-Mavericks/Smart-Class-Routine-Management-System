import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import RoutineInputProcessor from '../controllers/ROUTINE/routineInputProcessorController.js';
import fs from 'fs/promises'; // Import fs/promises for async file operations
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Set up Chai
chai.use(chaiAsPromised);
const { expect } = chai;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read test inputs from JSON file
const inputFilePath = join(__dirname, '../testCases/scheduleInput.json');

describe('RoutineInputProcessor', function() {
    let routineInputProcessor;
    let scheduleInputs;

    before(async function() {
        // Read schedule input data
        const data = await fs.readFile(inputFilePath, 'utf8');
        scheduleInputs = JSON.parse(data); // Parse the JSON data
        routineInputProcessor = new RoutineInputProcessor();
        console.log('Connected to mock database');
    });

    beforeEach(function() {
        // Stub the createSchedule method with mock response from JSON
        const mockResponse = scheduleInputs.mockResponse; // Use mock response from JSON
        sinon.stub(routineInputProcessor, 'createSchedule').resolves(mockResponse);
    });

    afterEach(function() {
        // Restore stubbed methods
        sinon.restore();
    });

    it('should generate timeslots with valid parameters', async function() {
        const scheduleDetails = scheduleInputs.validInputs[0]; // Use the first valid input from JSON

        const result = await routineInputProcessor.processSchedule(scheduleDetails);
        
        expect(result.slots).to.have.lengthOf(5); // Confirm slot count
        expect(result.lunchBreak).to.exist; // Check lunch break presence
        expect(result.lunchBreak.duration).to.equal(scheduleDetails.lunchDuration); // Confirm lunch duration
    });

    it('should throw an error when missing required parameters', async function() {
        const scheduleDetails = scheduleInputs.invalidInputs[0]; // Use the first invalid input from JSON

        await expect(routineInputProcessor.processSchedule(scheduleDetails)).to.be.rejectedWith('Missing required parameters.');
    });
});
