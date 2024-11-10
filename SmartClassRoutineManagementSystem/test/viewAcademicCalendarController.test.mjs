// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// const ViewAcademicCalendarController = require('../controllers/viewAcademicCalendarController');
// const testCases = require('./testCases.json');


// Replace require with import
import { expect } from 'chai';
import ViewAcademicCalendarController from '../controllers/viewAcademicCalendarController.js';
import sinon from 'sinon';
import academicCalendarModel from '../models/academicCalendarModel.js';
import testCases from './testCases.json' assert { type: 'json' };



describe("ViewAcademicCalendarController Tests", function() {

  // Test for getAllEvents function
  it("should return all events for getAllEvents", function(done) {
    const req = {}; // empty request object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  
    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.allEvents.expectedOutput, null, 5));
      console.log("Actual Output:", JSON.stringify(result, null, 5));
      expect(result).to.deep.equal(testCases.allEvents.expectedOutput);
      done();
    });
  
    ViewAcademicCalendarController.getAllEvents(req, res); // This should now work
  });
  


  // Test for getHolidayEventsView function
  it("should return general holidays for getHolidayEventsView", function(done) {
    const req = {}; // empty request object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    
    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.holidayEvents.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.holidayEvents.expectedOutput);
      done();
    });
    
    ViewAcademicCalendarController.getHolidayEventsView(req, res);
  });

  // Test for getEventsByDepartment function
  it("should return events for specified department", function(done) {
    const req = { params: { department: testCases.eventsByDepartment.input[0] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    
    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.eventsByDepartment.expectedOutput, null, 3));
      console.log("Actual Output:", JSON.stringify(result, null, 3));
      expect(result).to.deep.equal(testCases.eventsByDepartment.expectedOutput);
      done();
    });
    
    ViewAcademicCalendarController.getEventsByDepartment(req, res);
  });

  // Test for getEventsByMonth function
  it("should return events for specified month", function(done) {
    const req = { params: { month: testCases.eventsByMonth.input[0] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    
    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.eventsByMonth.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.eventsByMonth.expectedOutput);
      done();
    });
    
    ViewAcademicCalendarController.getEventsByMonth(req, res);
  });

// Test for getEventsByWeek function
it("should return events for specified week", function(done) {
  const req = { params: { week: testCases.eventsByWeek.input[0] } };
  const res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub()
  };
  
  res.json.callsFake((result) => {
    console.log("Expected Output:", JSON.stringify(testCases.eventsByWeek.expectedOutput, null, 2));
    console.log("Actual Output:", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(testCases.eventsByWeek.expectedOutput);
    done();
  });
  
  ViewAcademicCalendarController.getEventsByWeek(req, res);
});

  // Test for getVacationsByDateRange function
  it("should return vacations within date range", function(done) {
    const req = { params: { startDate: testCases.vacationsByDateRange.input[0], endDate: testCases.vacationsByDateRange.input[1] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    
    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.vacationsByDateRange.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.vacationsByDateRange.expectedOutput);
      done();
    });
    
    ViewAcademicCalendarController.getVacationsByDateRange(req, res);
  });

  // Test for getActivitiesByDateRange function
  it("should return activities within date range", function(done) {
    const req = { params: { startDate: testCases.activitiesByDateRange.input[0], endDate: testCases.activitiesByDateRange.input[1] } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    
    res.json.callsFake((result) => {
      console.log("Expected Output:", JSON.stringify(testCases.activitiesByDateRange.expectedOutput, null, 2));
      console.log("Actual Output:", JSON.stringify(result, null, 2));
      expect(result).to.deep.equal(testCases.activitiesByDateRange.expectedOutput);
      done();
    });
    
    ViewAcademicCalendarController.getActivitiesByDateRange(req, res);
  });
});
