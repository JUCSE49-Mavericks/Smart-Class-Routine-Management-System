import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import RoutineInputProcessor from '../controllers/ROUTINE/routineInputProcessor.js';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('RoutineInputProcessor', function() {
    let routineInputProcessor;

    before(async function() {
        routineInputProcessor = new RoutineInputProcessor();
        console.log('Connected to mock database');
    });

    beforeEach(function() {
        // Stub database methods if necessary
        sinon.stub(routineInputProcessor, 'createSchedule').resolves({
            department: 'Computer Science',
            slots: [
                { slotNumber: 1, startTime: '09:00', endTime: '10:00', duration: 60 },
                { slotNumber: 2, startTime: '10:00', endTime: '11:00', duration: 60 },
                { slotNumber: 3, startTime: '11:00', endTime: '12:00', duration: 60 },
                { slotNumber: 4, startTime: '13:00', endTime: '14:00', duration: 60 },
                { slotNumber: 5, startTime: '14:00', endTime: '15:00', duration: 60 },
            ],
            lunchBreak: { duration: 30, startTime: '12:00', endTime: '12:30' }
        });
    });

    afterEach(function() {
        // Restore stubbed methods
        sinon.restore();
    });

    it('should generate timeslots with valid parameters', async function() {
        const scheduleDetails = {
            department: 'Computer Science',
            slotCount: 5,
            slotDuration: 60,
            startTime: '09:00',
            endTime: '17:00',
            lunchDuration: 30,
            lunchTime: '12:00'
        };

        const result = await routineInputProcessor.processSchedule(scheduleDetails);
        
        expect(result.slots).to.have.lengthOf(5); // Confirm slot count
        expect(result.lunchBreak).to.exist; // Check lunch break presence
        expect(result.lunchBreak.duration).to.equal(scheduleDetails.lunchDuration); // Confirm lunch duration
    });

    it('should throw an error when missing required parameters', async function() {
        const scheduleDetails = {
            department: 'Computer Science & Engineering',
            slotCount: 5,
            slotDuration: 60,
            lunchDuration: 30,
            lunchTime: '12:00'
        };

        await expect(routineInputProcessor.processSchedule(scheduleDetails)).to.be.rejectedWith('Missing required parameters.');
    });
});
