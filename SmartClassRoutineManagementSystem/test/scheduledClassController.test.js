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


// const rescheduleClass = require('../controllers/scheduleClassController').rescheduleScheduledClass;

// const testCases = require('./testFiles/rescheduleScheduledClassTestCases.json').rescheduleScheduledClass;


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


// describe('Reschedule Scheduled Class Controller', () => {
//     let queryStub;
  
//     beforeEach(() => {
//       queryStub = sinon.stub(db, 'query');
//     });
  
//     afterEach(() => {
//       queryStub.restore();
//     });
  
//     testCases.forEach((testCase) => {
//       it(testCase.description, (done) => {
//         const { scheduled_class_id } = testCase.params;
//         const { new_date, new_time_slot_id } = testCase.body;
  
//         if (testCase.dbError) {
//           queryStub.yields(testCase.dbError, null);
//         } else {
//           queryStub.yields(null, testCase.dbResponse);
//         }
  
//         chai
//           .request(app)
//           .patch(`http://localhost:5002/api/reschedule-class/${scheduled_class_id}`)
//           .send({ new_date, new_time_slot_id })
//           .end((err, res) => {
//             expect(res).to.have.status(testCase.expectedStatus);
//             expect(res.body.message).to.equal(testCase.expectedMessage);
//             done();
//           });
//       });
//     });
//   });