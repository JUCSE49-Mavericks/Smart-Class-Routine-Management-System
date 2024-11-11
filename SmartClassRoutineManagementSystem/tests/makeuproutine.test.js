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
      // Mock the getClassesNeeded method based on the test case
      if (testCase.classesNeeded === "error") {
        sandbox.stub(MakeupScheduleModel, 'getClassesNeeded').returns(Promise.resolve("error"));
      } else {
        sandbox.stub(MakeupScheduleModel, 'getClassesNeeded').returns(Promise.resolve(testCase.classesNeeded));
      }

      // Mock the getCourseType method, fetch from DB (returns from stubbed database)
      const courseType = testCase.courseType || "Theory"; // Default to "Theory" if courseType is not provided in the test case
      sandbox.stub(MakeupScheduleModel, 'getCourseTypeByCourseName').returns(Promise.resolve(courseType));

      req.body = {
        courseName: testCase.courseName,
        teacherName: testCase.teacherName,
        preferredDays: testCase.preferredDays || [],  // Default to empty array if no days are specified
        preferredTimes: testCase.preferredTimes || [],  // Default to empty array if no times are specified
        preferredRoom: testCase.preferredRoom || "Room101",  // Default room if not specified
      };

      // Check for invalid preferredDays and preferredTimes
      if (testCase.preferredDays && !areValidDays(testCase.preferredDays)) {
        res.status(400).json({ message: "Invalid preferred days provided" });
        return;
      }

      if (testCase.preferredTimes && !areValidTimes(testCase.preferredTimes)) {
        res.status(400).json({ message: "Invalid preferred times provided" });
        return;
      }

      // Validate preferred room
      if (testCase.preferredRoom && !isValidRoom(testCase.preferredRoom)) {
        res.status(400).json({ message: "Invalid preferred room provided" });
        return;
      }

      // Call the controller function
      await MakeupScheduleController.generateMakeupSchedule(req, res);

      // Extract the response
      const expectedMessage = testCase.expectedMessage;
      const response = res.json.getCall(0).args[0];

      // Validate status and message
      expect(res.status.calledWith(testCase.expectedStatus)).to.be.true;
      expect(response.message).to.equal(expectedMessage);

      // Check the schedule if it was generated
      if (expectedMessage === "Makeup schedule generated successfully") {
        expect(response.schedule).to.be.an('array').that.is.not.empty;
      } else if (expectedMessage === "No makeup classes needed") {
        expect(response.schedule).to.be.an('array').that.is.empty;
      }
    });
  });
});

// Helper function to check if preferredDays are valid weekdays
function areValidDays(days) {
  const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"];
  return days.every(day => validDays.includes(day));
}

// Helper function to check if preferredTimes are valid
function areValidTimes(times) {
  return times.every(time => {
    const { start, end } = time;
    // Check if start and end times are in a valid format and if start < end
    const startTime = parseTime(start);
    const endTime = parseTime(end);
    return startTime !== null && endTime !== null && startTime < endTime;
  });
}

// Helper function to parse time in "HH:MM" format
function parseTime(time) {
  const timeParts = time.split(':');
  if (timeParts.length !== 2) return null;
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes; // Convert time to minutes since start of the day
}

// Helper function to validate preferred room
function isValidRoom(room) {
  const validRooms = ["101", "102", "103", "201", "203", "302"]; // List of valid rooms
  return validRooms.includes(room);
}
