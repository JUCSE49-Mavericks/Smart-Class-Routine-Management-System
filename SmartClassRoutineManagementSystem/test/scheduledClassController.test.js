const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const db = require('../config/db'); 
const app = require('../app');
const { getScheduledClassesByTeacherId, updateStatusToConducted } = require('../models/scheduledClassModel');
const scheduledClassesTestCases = require('./testFiles/getScheduledClassByTeacherId.json');
const httpMocks = require('node-mocks-http');



const { confirmClass } = require('../models/scheduledClassModel');
const { confirmScheduledClass } = require('../controllers/scheduleClassController');
const confirmClassTestCases = require('./testFiles/confirmClassTestCases.json');


const { cancelClass } = require('../models/scheduledClassModel');
const { cancelScheduledClass } = require('../controllers/scheduleClassController');
const cancelClassTestCases = require('./testFiles/cancelClassTestCases.json');


const { setNotConfirmed } = require('../models/scheduledClassModel');
const { setClassNotConfirmed } = require('../controllers/scheduleClassController');
const setNotConfirmedTestCases = require('./testFiles/setClassNotConfirmedTestCases.json');

const { getTimeSlots } = require('../models/scheduledClassModel');
const { fetchTimeSlots } = require('../controllers/scheduleClassController');
const fetchTimeSlotTestCases = require('./testFiles/fetchTimeSlotsTestCases.json');



// const { rescheduleScheduledClass } = require('../controllers/scheduleClassController');
// const { rescheduleClass } = require('../models/scheduledClassModel');
const testData = require('./testFiles/rescheduleClassTestData.json');

describe('Scheduled Classes', () => {

    describe('getScheduledClassesByTeacherId', () => {
        scheduledClassesTestCases.fetchScheduledClasses.forEach(testCase => {
            it(testCase.description, (done) => {
                // Mock database response
                const dbStub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                    callback(null, testCase.expectedResult);
                });

                getScheduledClassesByTeacherId(testCase.teacherId, (error, results) => {
                    expect(error).to.be.null;
                    expect(results).to.deep.equal(testCase.expectedResult);
                    dbStub.restore();
                    done();
                });
            });
        });
    });

    describe('updateStatusToConducted', () => {
        scheduledClassesTestCases.updateStatusToConducted.forEach(testCase => {
            it(testCase.description, (done) => {
                // Mock database response
                const dbStub = sinon.stub(db, 'query').callsFake((query, callback) => {
                    callback(null, { affectedRows: testCase.expectedAffectedRows });
                });

                updateStatusToConducted((error, results) => {
                    expect(error).to.be.null;
                    expect(results.affectedRows).to.equal(testCase.expectedAffectedRows);
                    dbStub.restore();
                    done();
                });
            });
        });
    });

});


describe('confirmScheduledClass Controller', () => {

    confirmClassTestCases.confirmScheduledClass.forEach((testCase) => {
        it(testCase.description, (done) => {
            // Mocking database query behavior
            const dbStub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                if (testCase.dbError) {
                    callback(testCase.dbError, null);
                } else {
                    callback(null, testCase.dbResponse);
                }
            });

            // Mocking request and response
            const req = httpMocks.createRequest({
                method: 'PATCH',
                url: `/api/schedule/confirm/${testCase.scheduled_class_id}`,
                params: {
                    scheduled_class_id: testCase.scheduled_class_id
                }
            });
            const res = httpMocks.createResponse();

            confirmScheduledClass(req, res);

            // Use setImmediate to ensure response is sent
            setImmediate(() => {
                expect(res.statusCode).to.equal(testCase.expectedStatus);
                const data = res._getJSONData();

                if (testCase.expectedStatus === 200) {
                    expect(data.message).to.equal(testCase.expectedMessage);
                } else {
                    expect(data.message).to.equal(testCase.expectedMessage);
                }
                dbStub.restore();
                done();
            });
        });
    });
});


describe('cancelScheduledClass Controller', () => {

    afterEach(() => {
        sinon.restore(); // Ensure all stubs are restored after each test
    });

    cancelClassTestCases.cancelScheduledClass.forEach((testCase) => {
        it(testCase.description, (done) => {
            // Mocking the database query behavior
            const dbStub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                if (testCase.dbError) {
                    callback(testCase.dbError, null);
                } else {
                    callback(null, testCase.dbResponse);
                }
            });

            // Mocking request and response
            const req = httpMocks.createRequest({
                method: 'PATCH',
                url: `/api/schedule/cancel/${testCase.scheduled_class_id}`,
                params: {
                    scheduled_class_id: testCase.scheduled_class_id
                }
            });
            const res = httpMocks.createResponse();

            cancelScheduledClass(req, res);

            // Use setImmediate to ensure response is sent
            setImmediate(() => {
                expect(res.statusCode).to.equal(testCase.expectedStatus);
                const data = res._getJSONData();
                expect(data.message).to.equal(testCase.expectedMessage);
                done();
            });
        });
    });
});



describe('setClassNotConfirmed Controller', () => {
    afterEach(() => {
        sinon.restore(); // Ensure all stubs are restored after each test
    });

    setNotConfirmedTestCases.setClassNotConfirmed.forEach((testCase) => {
        it(testCase.description, (done) => {
            // Mocking the database query behavior
            const dbStub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                if (testCase.dbError) {
                    callback(testCase.dbError, null);
                } else {
                    callback(null, testCase.dbResponse);
                }
            });

            // Mocking request and response
            const req = httpMocks.createRequest({
                method: 'PATCH',
                url: `/api/schedule/set-not-confirmed/${testCase.scheduled_class_id}`,
                params: {
                    scheduled_class_id: testCase.scheduled_class_id
                }
            });
            const res = httpMocks.createResponse();

            setClassNotConfirmed(req, res);

            // Use setImmediate to ensure response is sent
            setImmediate(() => {
                expect(res.statusCode).to.equal(testCase.expectedStatus);
                const data = res._getJSONData();
                expect(data.message).to.equal(testCase.expectedMessage);
                done();
            });
        });
    });
});



describe('fetchTimeSlots Controller', () => {
    afterEach(() => {
        sinon.restore(); // Ensure all stubs are restored after each test
    });

    fetchTimeSlotTestCases.fetchTimeSlots.forEach((testCase) => {
        it(testCase.description, (done) => {
            // Mocking the database query behavior
            const dbStub = sinon.stub(db, 'query').callsFake((query, callback) => {
                if (testCase.dbError) {
                    callback(testCase.dbError, null);
                } else {
                    callback(null, testCase.dbResponse);
                }
            });

            // Mocking request and response
            const req = httpMocks.createRequest({
                method: 'GET',
                url: '/api/timeslots'
            });
            const res = httpMocks.createResponse();

            fetchTimeSlots(req, res);

            // Use setImmediate to ensure response is sent
            setImmediate(() => {
                expect(res.statusCode).to.equal(testCase.expectedStatus);

                if (testCase.expectedStatus === 200) {
                    const data = res._getJSONData();
                    expect(data).to.deep.equal(testCase.expectedResponse);
                } else {
                    const data = res._getJSONData();
                    expect(data.message).to.equal(testCase.expectedMessage);
                }

                done();
            });
        });
    });
});


const { rescheduleClass } = require('../models/scheduledClassModel'); // Ensure you're importing the function
const { rescheduleScheduledClass } = require('../controllers/scheduleClassController'); // Controller import

describe('Scheduled Class Controller - Reschedule Class', function () {
    let sandbox;
  
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    it('should reschedule a class successfully', async function () {
      const mockResults = { affectedRows: 1 };
  
      // Correct way to stub the rescheduleClass function
      sandbox.stub(rescheduleClass, 'rescheduleClass').callsFake((scheduledClassId, newDate, newTimeSlotId, callback) => {
        callback(null, mockResults);
      });
  
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
  
      await rescheduleScheduledClass(req, res);
  
      sinon.assert.calledOnce(rescheduleClass.rescheduleClass);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, { message: 'Class rescheduled successfully' });
    });
  
    it('should return 404 if no class is found to reschedule', async function () {
      const mockResults = { affectedRows: 0 };
  
      sandbox.stub(rescheduleClass, 'rescheduleClass').callsFake((scheduledClassId, newDate, newTimeSlotId, callback) => {
        callback(null, mockResults);
      });
  
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
  
      await rescheduleScheduledClass(req, res);
  
      sinon.assert.calledOnce(rescheduleClass.rescheduleClass);
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledWith(res.json, { message: 'No class found to confirm' });
    });
  
    it('should handle database errors', async function () {
      const dbError = new Error('Database Error');
      sandbox.stub(rescheduleClass, 'rescheduleClass').callsFake((scheduledClassId, newDate, newTimeSlotId, callback) => {
        callback(dbError, null);
      });
  
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
  
      await rescheduleScheduledClass(req, res);
  
      sinon.assert.calledOnce(rescheduleClass.rescheduleClass);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: 'Failed to reschedule class', error: dbError });
    });
  });