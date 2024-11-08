const chai = require('chai');
const expect = chai.expect;
const ViewAcademicCalendarController = require('../controllers/viewAcademicCalendarController');
const testCases = require('./testCases.json');

describe("ViewAcademicCalendarController Tests", function() {
  it("should return general holidays for getGeneralizedView", async function() {
    const result = await ViewAcademicCalendarController.getGeneralizedView();
    console.log("Expected Output:", JSON.stringify(testCases.generalEvents.expectedOutput, null, 2));
    console.log("Actual Output:", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(testCases.generalEvents.expectedOutput);
  });

  it("should return events for specified department", async function() {
    const result = await ViewAcademicCalendarController.getEventsByDepartment(testCases.eventsByDepartment.input[0]);
    console.log("Expected Output:", JSON.stringify(testCases.eventsByDepartment.expectedOutput, null, 2));
    console.log("Actual Output:", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(testCases.eventsByDepartment.expectedOutput);
  });

  it("should return events for specified month", async function() {
    const result = await ViewAcademicCalendarController.getEventsByMonth(testCases.eventsByMonth.input[0]);
    console.log("Expected Output:", JSON.stringify(testCases.eventsByMonth.expectedOutput, null, 2));
    console.log("Actual Output:", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(testCases.eventsByMonth.expectedOutput);
  });

  it("should return vacations within date range", async function() {
    const [startDate, endDate] = testCases.vacationsByDateRange.input;
    const result = await ViewAcademicCalendarController.getVacationsByDateRange(startDate, endDate);
    console.log("Expected Output:", JSON.stringify(testCases.vacationsByDateRange.expectedOutput, null, 2));
    console.log("Actual Output:", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(testCases.vacationsByDateRange.expectedOutput);
  });

  it("should return activities within date range", async function() {
    const [startDate, endDate] = testCases.activitiesByDateRange.input;
    const result = await ViewAcademicCalendarController.getActivitiesByDateRange(startDate, endDate);
    console.log("Expected Output:", JSON.stringify(testCases.activitiesByDateRange.expectedOutput, null, 2));
    console.log("Actual Output:", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(testCases.activitiesByDateRange.expectedOutput);
  });
});
