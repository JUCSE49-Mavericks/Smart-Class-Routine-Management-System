// test/makeupScheduleController.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const { exec } = require('child_process');
const MakeupScheduleModel = require('../models/makeupclassRoutineModel');
const makeupScheduleController = require('../controllers/makeuproutinegeneratorcontroller');
const fs = require('fs');

// Test Data
const testData = JSON.parse(fs.readFileSync('./tests/makeuproutinetestfile.json', 'utf8'));

describe('generateMakeupSchedule', function () {
    let execStub;
    let getClassesNeededStub;

    // Setup before each test
    beforeEach(() => {
        // Mock the exec function
        execStub = sinon.stub(exec);

        // Mock the database model's getClassesNeeded method
        getClassesNeededStub = sinon.stub(MakeupScheduleModel, 'getClassesNeeded');
    });

    // Cleanup after each test
    afterEach(() => {
        execStub.restore();
        getClassesNeededStub.restore();
    });

    testData.forEach(testCase => {
        it(`should return the correct schedule for ${testCase.courseName}`, async function () {
            getClassesNeededStub.resolves(testCase.classesNeeded);

            if (testCase.classesNeeded > 0) {
                // Mocking the Python script's output
                execStub.callsFake((command, callback) => {
                    callback(null, JSON.stringify(testCase.expectedSchedule), null);
                });

                const schedule = await makeupScheduleController.generateMakeupSchedule(testCase.courseName);
                expect(schedule).to.deep.equal(testCase.expectedSchedule);
            } else {
                // Handling case where no classes are needed
                try {
                    await makeupScheduleController.generateMakeupSchedule(testCase.courseName);
                } catch (error) {
                    expect(error.message).to.equal(testCase.expectedError);
                }
            }
        });
    });
});
