// Import modules with ES6 syntax
import { expect } from 'chai';
import ViewAcademicCalendarController from '../controllers/viewAcademicCalendarController.js';
import sinon from 'sinon';
import academicCalendarModel from '../models/academicCalendarModel.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read test data asynchronously
const readTestData = async () => {
  const filePath = path.resolve(__dirname, './testCases.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

describe("ViewAcademicCalendarController Tests", function() {
  let testCases;

  // Load test data before running tests
  before(async function() {
    testCases = await readTestData();
  });

  // Test for getAllEvents function
  it("should return all events for getAllEvents", async function() {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.allEvents.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.allEvents.expectedOutput);
    });

    await ViewAcademicCalendarController.getAllEvents(req, res);
  });

  // Test for getHolidayEventsView function
  it("should return general holidays for getHolidayEventsView", async function() {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.holidayEvents.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.holidayEvents.expectedOutput);
    });

    await ViewAcademicCalendarController.getHolidayEventsView(req, res);
  });

  // Test for getEventsByDepartment function
  it("should return events for specified department", async function() {
    const req = { params: { department: testCases.eventsByDepartment.input[0] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.eventsByDepartment.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.eventsByDepartment.expectedOutput);
    });

    await ViewAcademicCalendarController.getEventsByDepartment(req, res);
  });

  // Test for getEventsByMonth function
  it("should return events for specified month", async function() {
    const req = { params: { month: testCases.eventsByMonth.input[0] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.eventsByMonth.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.eventsByMonth.expectedOutput);
    });

    await ViewAcademicCalendarController.getEventsByMonth(req, res);
  });

  // Test for getEventsByWeek function
  it("should return events for specified week", async function() {
    const req = { params: { week: testCases.eventsByWeek.input[0] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.eventsByWeek.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.eventsByWeek.expectedOutput);
    });

    await ViewAcademicCalendarController.getEventsByWeek(req, res);
  });

  // Test for getVacationsByDateRange function
  it("should return vacations within date range", async function() {
    const req = { params: { startDate: testCases.vacationsByDateRange.input[0], endDate: testCases.vacationsByDateRange.input[1] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.vacationsByDateRange.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.vacationsByDateRange.expectedOutput);
    });

    await ViewAcademicCalendarController.getVacationsByDateRange(req, res);
  });

  // Test for getActivitiesByDateRange function
  it("should return activities within date range", async function() {
    const req = { params: { startDate: testCases.activitiesByDateRange.input[0], endDate: testCases.activitiesByDateRange.input[1] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.activitiesByDateRange.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.activitiesByDateRange.expectedOutput);
    });

    await ViewAcademicCalendarController.getActivitiesByDateRange(req, res);
  });
});
