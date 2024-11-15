const chai = require('chai');
const sinon = require('sinon');
const MakeupScheduleController = require('../controllers/makeuproutinegeneratorcontroller');
const MakeupScheduleModel = require('../models/makeupclassRoutineModel');
const testCases = require('./makeuproutinetestfile.json');

const { expect } = chai;

describe('MakeupScheduleController', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Simulate error case where classesNeeded = 'error'
      if (testCase.classesNeeded === "error") {
        sandbox.stub(MakeupScheduleModel, 'getClassesNeeded').throws(new Error('Database error'));
      } else {
        sandbox.stub(MakeupScheduleModel, 'getClassesNeeded').resolves(testCase.classesNeeded);
      }

      req.body.courseName = testCase.courseName;
      req.body.teacherName = testCase.teacherName;

      // Loop through each preferred time slot in the test case
      (testCase.preferredTimes || [null]).forEach(async (preferredTime) => {
        req.body.preferredStartTime = preferredTime?.start || null;
        req.body.preferredEndTime = preferredTime?.end || null;

        await MakeupScheduleController.generateMakeupSchedule(req, res);

        expect(res.status.calledWith(testCase.expectedStatus)).to.be.true;
        expect(res.json.calledWithMatch({ message: testCase.expectedMessage })).to.be.true;

        // If successful, check the schedule response
        if (testCase.expectedStatus === 200 && testCase.classesNeeded > 0) {
          const jsonResponse = res.json.firstCall.args[0];

          console.log("Generated Schedule:", jsonResponse.schedule);

          expect(jsonResponse).to.have.property('schedule').that.is.an('array');
          expect(jsonResponse.schedule.length).to.equal(testCase.classesNeeded);

          jsonResponse.schedule.forEach((slot) => {
            const [start, end] = slot.time.split(' - ');

            // Use preferred time slot if available, otherwise fall back to default
            const startCheck = preferredTime?.start || "09:00";
            const endCheck = preferredTime?.end || "10:00";

            expect(start).to.equal(startCheck);
            expect(end).to.equal(endCheck);

            // Ensure the schedule falls within a valid day time (09:00 - 16:00)
            const minTime = "09:00";
            const maxTime = "16:00";
            expect(start >= minTime && end <= maxTime).to.be.true;
          });
        }
      });
    });
  });
});

