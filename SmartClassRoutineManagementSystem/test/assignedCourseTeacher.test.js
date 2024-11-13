// test/assignedCourseTeacherController.test.js
const fs = require('fs');
const path = require('path');

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const db = require('../config/db');
const {
    handleUpdateAssignedCourseTeacher,
    insertAssignedCourseTeacherObject,
    getAssignedCourseTeachers,
    fetchCoursesByExamYearId,
    uploadCSVAssignedCourseTeacher,
} = require('../controllers/assignedCourseTeacherController');

const {
    updateAssignedCourseTeacher,
    addAssignedCourseTeacherObject,
    getAssignedCourseTeachersByExamYearId,
    getCoursesByExamYearId,
    uploadCSVAssignedCourseTeacherModel
} = require('../models/assignedCourseTeacherModel');


const testInputAssignedCourseTeacher = require('./testInputAssignedCourseTeacher.json');
const inputTestAssignCourseTeacherByTeacher_id = require('./inputTestAssignCourseTeacherByTeacher_id');


describe('Assigned Course Teacher Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(db, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('handleUpdateAssignedCourseTeacher', () => {
        it('should update the teacher for an existing course', async () => {
            req = testInputAssignedCourseTeacher.updateExistingCourse.req; // Use input from JSON
            db.query.onCall(0).callsArgWith(2, null, testInputAssignedCourseTeacher.updateExistingCourse.dbResponses[0]); // Existing course
            db.query.onCall(1).callsArgWith(2, null, testInputAssignedCourseTeacher.updateExistingCourse.dbResponses[1]); // Update response

            await handleUpdateAssignedCourseTeacher(req, res);

            expect(res.status.calledWith(testInputAssignedCourseTeacher.updateExistingCourse.expectedResponse.status)).to.be.true;
            expect(res.json.calledWith(sinon.match(testInputAssignedCourseTeacher.updateExistingCourse.expectedResponse.body))).to.be.true;
        });

        it('should insert a new course-teacher assignment if course does not exist', async () => {
            req = testInputAssignedCourseTeacher.insertNewAssignment.req; // Use input from JSON
            db.query.onCall(0).callsArgWith(2, null, testInputAssignedCourseTeacher.insertNewAssignment.dbResponses[0]); // No existing course
            db.query.onCall(1).callsArgWith(2, null, testInputAssignedCourseTeacher.insertNewAssignment.dbResponses[1]); // Insert response

            await handleUpdateAssignedCourseTeacher(req, res);

            expect(res.status.calledWith(testInputAssignedCourseTeacher.insertNewAssignment.expectedResponse.status)).to.be.true;
            expect(res.json.calledWith(sinon.match(testInputAssignedCourseTeacher.insertNewAssignment.expectedResponse.body))).to.be.true;
        });

        it('should return an error if there is a database error', async () => {
            req = testInputAssignedCourseTeacher.databaseError.req; // Use input from JSON
            db.query.onCall(0).callsArgWith(2, new Error('Database error'), null);

            await handleUpdateAssignedCourseTeacher(req, res);

            expect(res.status.calledWith(testInputAssignedCourseTeacher.databaseError.expectedResponse.status)).to.be.true;
            expect(res.json.calledWith(sinon.match(testInputAssignedCourseTeacher.databaseError.expectedResponse.body))).to.be.true;
        });
    });

    describe('updateAssignedCourseTeacher', () => {
        it('should update an existing assignment', async () => {
            db.query.onCall(0).callsArgWith(2, null, [{ assigned_course_teacher_id: 1 }]);
            db.query.onCall(1).callsArgWith(2, null, { affectedRows: 1 });

            const result = await updateAssignedCourseTeacher(1, 2);

            expect(result).to.deep.equal({ message: 'Teacher updated for existing course', results: { affectedRows: 1 } });
        });

        it('should insert a new assignment if none exists', async () => {
            db.query.onCall(0).callsArgWith(2, null, []);
            db.query.onCall(1).callsArgWith(2, null, { affectedRows: 1 });

            const result = await updateAssignedCourseTeacher(1, 2);

            expect(result).to.deep.equal({ message: 'New course-teacher assignment added', results: { affectedRows: 1 } });
        });

        it('should reject with an error if the query fails', async () => {
            db.query.onCall(0).callsArgWith(2, new Error('Database error'), null);

            try {
                await updateAssignedCourseTeacher(1, 2);
                expect.fail('Expected method to throw an error.');
            } catch (error) {
                expect(error).to.be.an('error').and.have.property('message', 'Database error');
            }
        });
    });
});




describe('Assigned Course Teacher Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { ...inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.req.body } // Use input from JSON
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(db, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('insertAssignedCourseTeacherObject', () => {
        it('should successfully insert a new course-teacher assignment', async () => {
            db.query.onCall(0).callsArgWith(2, null, []); // No existing assignment
            db.query.onCall(1).callsArgWith(2, null, { affectedRows: 1 }); // Insert response

            await insertAssignedCourseTeacherObject(req, res);

            expect(res.status.calledWith(inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.responses.successInsert.status)).to.be.true;
            expect(res.json.calledWith(sinon.match(inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.responses.successInsert.body))).to.be.true;
        });

        it('should not insert a course-teacher assignment if one already exists', async () => {
            db.query.onCall(0).callsArgWith(2, null, [{ course_id: 1 }]); // Existing assignment

            await insertAssignedCourseTeacherObject(req, res);

            expect(res.status.calledWith(inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.responses.existingAssignment.status)).to.be.true;
            expect(res.json.calledWith(sinon.match(inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.responses.existingAssignment.body))).to.be.true;
        });

        it('should return an error if there is a database error', async () => {
            db.query.onCall(0).callsArgWith(2, new Error('Database error'), null);

            await insertAssignedCourseTeacherObject(req, res);

            expect(res.status.calledWith(inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.responses.databaseError.status)).to.be.true;
            expect(res.json.calledWith(sinon.match(inputTestAssignCourseTeacherByTeacher_id.insertAssignedCourseTeacherObject.responses.databaseError.body))).to.be.true;
        });
    });

    describe('addAssignedCourseTeacherObject', () => {
        it('should add a new course-teacher assignment if none exists', async () => {
            db.query.onCall(0).callsArgWith(2, null, []); // No existing assignment
            db.query.onCall(1).callsArgWith(2, null, { affectedRows: 1 }); // Insert response

            const result = await addAssignedCourseTeacherObject(1, 2023);

            expect(result).to.deep.equal(inputTestAssignCourseTeacherByTeacher_id.addAssignedCourseTeacherObject.responses.successAdd);
        });

        it('should not add an assignment if it already exists', async () => {
            db.query.onCall(0).callsArgWith(2, null, [{ course_id: 1 }]); // Existing assignment

            const result = await addAssignedCourseTeacherObject(1, 2023);

            expect(result).to.deep.equal(inputTestAssignCourseTeacherByTeacher_id.addAssignedCourseTeacherObject.responses.existingAssignment);
        });

        it('should reject with an error if the query fails', async () => {
            db.query.onCall(0).callsArgWith(2, new Error('Database error'), null);

            try {
                await addAssignedCourseTeacherObject(1, 2023);
                // Fail the test if no error was thrown
                expect.fail('Expected method to throw an error.');
            } catch (error) {
                expect(error).to.be.an('error').and.have.property('message', inputTestAssignCourseTeacherByTeacher_id.addAssignedCourseTeacherObject.responses.databaseError.error);
            }
        });
    });
});

const fetchTeachersTestData = require('./fetchTeachersTestData.json'); // Importing test data

describe('Fetch Teachers by exam year id', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { ...fetchTeachersTestData.getAssignedCourseTeachers.req.params } // Use input from JSON
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(db, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAssignedCourseTeachers', () => {
        it('should retrieve assigned course teachers successfully', async () => {
            const mockResults = fetchTeachersTestData.getAssignedCourseTeachers.responses.success.data;
            db.query.callsArgWith(2, null, mockResults); // Mock database response

            await getAssignedCourseTeachers(req, res);

            expect(res.status.calledWith(fetchTeachersTestData.getAssignedCourseTeachers.responses.success.status)).to.be.true;
            expect(res.json.calledWith(mockResults)).to.be.true;
        });

        it('should handle database errors gracefully', async () => {
            const mockError = new Error(fetchTeachersTestData.getAssignedCourseTeachers.responses.databaseError.error);
            db.query.callsArgWith(2, mockError, null);

            await getAssignedCourseTeachers(req, res);

            expect(res.status.calledWith(fetchTeachersTestData.getAssignedCourseTeachers.responses.databaseError.status)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                message: fetchTeachersTestData.getAssignedCourseTeachers.responses.databaseError.message,
                error: mockError
            }))).to.be.true;
        });
    });

    describe('getAssignedCourseTeachersByExamYearId', () => {
        it('should return assigned course teachers for a given exam year ID', async () => {
            const mockResults = fetchTeachersTestData.getAssignedCourseTeachersByExamYearId.responses.success;
            db.query.callsArgWith(2, null, mockResults); // Mock database response

            const result = await getAssignedCourseTeachersByExamYearId(2023);

            expect(result).to.deep.equal(mockResults);
        });

        it('should reject with an error if the query fails', async () => {
            const mockError = new Error(fetchTeachersTestData.getAssignedCourseTeachersByExamYearId.responses.databaseError);
            db.query.callsArgWith(2, mockError, null);

            try {
                await getAssignedCourseTeachersByExamYearId(2023);
                expect.fail('Expected method to throw an error.'); // Fail the test if no error was thrown
            } catch (error) {
                expect(error).to.be.an('error').and.have.property('message', fetchTeachersTestData.getAssignedCourseTeachersByExamYearId.responses.databaseError);
            }
        });
    });
});


const coursesControllerTestData = require('./coursesControllerTestData.json'); // Import test data

describe('Courses Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { ...coursesControllerTestData.fetchCoursesByExamYearId.req.params } // Use request parameters from JSON
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(db, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('fetchCoursesByExamYearId', () => {
        it('should fetch courses assigned to teachers successfully', async () => {
            const mockResults = coursesControllerTestData.fetchCoursesByExamYearId.responses.success.data;
            db.query.callsArgWith(2, null, mockResults); // Mock database response

            await fetchCoursesByExamYearId(req, res);

            expect(res.status.calledWith(coursesControllerTestData.fetchCoursesByExamYearId.responses.success.status)).to.be.true;
            expect(res.json.calledWith(mockResults)).to.be.true;
        });

        it('should handle database errors gracefully', async () => {
            const mockError = new Error(coursesControllerTestData.fetchCoursesByExamYearId.responses.databaseError.error);
            db.query.callsArgWith(2, mockError, null);

            await fetchCoursesByExamYearId(req, res);

            expect(res.status.calledWith(coursesControllerTestData.fetchCoursesByExamYearId.responses.databaseError.status)).to.be.true;
            expect(res.json.calledWith(sinon.match({
                message: coursesControllerTestData.fetchCoursesByExamYearId.responses.databaseError.message,
                error: mockError
            }))).to.be.true;
        });
    });

    describe('getCoursesByExamYearId', () => {
        it('should return course details for a given exam year ID', async () => {
            const mockResults = coursesControllerTestData.getCoursesByExamYearId.responses.success;
            db.query.callsArgWith(2, null, mockResults); // Mock database response

            const result = await getCoursesByExamYearId(2023);

            expect(result).to.deep.equal(mockResults);
        });

        it('should reject with an error if the query fails', async () => {
            const mockError = new Error(coursesControllerTestData.getCoursesByExamYearId.responses.databaseError);
            db.query.callsArgWith(2, mockError, null);

            try {
                await getCoursesByExamYearId(2023);
                expect.fail('Expected method to throw an error.'); // Fail the test if no error was thrown
            } catch (error) {
                expect(error).to.be.an('error').and.have.property('message', coursesControllerTestData.getCoursesByExamYearId.responses.databaseError);
            }
        });
    });
});


// describe('CSV Upload Controller', () => {
//     let req, res;

//     beforeEach(() => {
//         req = {
//             body: {
//                 csvData: [
//                     { course_id: 1, teacher_id: 2 },
//                     { course_id: 3, teacher_id: 4 }
//                 ]
//             }
//         };

//         res = {
//             status: sinon.stub().returnsThis(),
//             json: sinon.spy()
//         };

//         sinon.stub(db, 'query');
//     });

//     afterEach(() => {
//         sinon.restore();
//     });

//     describe('uploadCSVAssignedCourseTeacher', () => {
//         it('should process CSV data and respond with success', async () => {
//             // Mocking the database responses for the first entry
//             db.query
//                 .onFirstCall().callsArgWith(2, null, []) // Simulating no existing course for course_id 1
//                 .onSecondCall().callsArgWith(2, null, { insertId: 1 }) // Simulating successful insert for course_id 1
//                 .onThirdCall().callsArgWith(2, null, []) // Simulating no existing course for course_id 3
//                 .onFourthCall().callsArgWith(2, null, { insertId: 2 }); // Simulating successful insert for course_id 3

//             await uploadCSVAssignedCourseTeacher(req, res);

//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.calledWith(sinon.match({ message: 'All records processed successfully' }))).to.be.true;
//         });

//         it('should handle errors during CSV processing', async () => {
//             // Simulating a database error for the first entry
//             db.query
//                 .onFirstCall().callsArgWith(2, new Error('Database error'), null);

//             await uploadCSVAssignedCourseTeacher(req, res);

//             expect(res.status.calledWith(500)).to.be.true;
//             expect(res.json.calledWith(sinon.match({ message: 'Error processing records' }))).to.be.true;
//         });
//     });

//     describe('processCSVData', () => {
//         it('should process records successfully', async () => {
//             db.query
//                 .onFirstCall().callsArgWith(2, null, []) // No existing course for course_id 1
//                 .onSecondCall().callsArgWith(2, null, { insertId: 1 }) // Successful insert for course_id 1
//                 .onThirdCall().callsArgWith(2, null, []) // No existing course for course_id 3
//                 .onFourthCall().callsArgWith(2, null, { insertId: 2 }); // Successful insert for course_id 3

//             const response = await processCSVData(req.body.csvData);

//             expect(response).to.deep.equal({ message: 'All records processed successfully', results: [{ insertId: 1 }, { insertId: 2 }] });
//         });

//         it('should throw an error if any record processing fails', async () => {
//             // Simulating an error during the processing of the second entry
//             db.query
//                 .onFirstCall().callsArgWith(2, null, []) // No existing course for course_id 1
//                 .onSecondCall().callsArgWith(2, null, { insertId: 1 }) // Successful insert for course_id 1
//                 .onThirdCall().callsArgWith(2, null, []) // No existing course for course_id 3
//                 .onFourthCall().callsArgWith(2, new Error('Database error')); // Error on insert for course_id 3

//             try {
//                 await processCSVData(req.body.csvData);
//                 // Fail the test if no error was thrown
//                 expect.fail('Expected method to throw an error.');
//             } catch (error) {
//                 expect(error).to.be.an('error').and.have.property('message', 'Error processing records');
//             }
//         });
//     });

//     describe('uploadCSVAssignedCourseTeacherModel', () => {
//         it('should insert a new assignment when the course does not exist', async () => {
//             db.query
//                 .onFirstCall().callsArgWith(2, null, []) // No existing course for course_id 1
//                 .onSecondCall().callsArgWith(2, null, { insertId: 1 }); // Successful insert

//             const result = await uploadCSVAssignedCourseTeacherModel(1, 2);
//             expect(result).to.deep.equal({ message: 'New course-teacher assignment added', results: { insertId: 1 } });
//         });

//         it('should update the existing assignment when the course exists', async () => {
//             db.query
//                 .onFirstCall().callsArgWith(2, null, [{ course_id: 1, teacher_id: 2 }]) // Existing course for course_id 1
//                 .onSecondCall().callsArgWith(2, null, { affectedRows: 1 }); // Successful update

//             const result = await uploadCSVAssignedCourseTeacherModel(1, 3);
//             expect(result).to.deep.equal({ message: 'Teacher updated for existing course', results: { affectedRows: 1 } });
//         });

//         it('should handle errors during the insert/update operations', async () => {
//             db.query
//                 .onFirstCall().callsArgWith(2, null, []) // No existing course for course_id 1
//                 .onSecondCall().callsArgWith(2, new Error('Insert error')); // Error on insert

//             try {
//                 await uploadCSVAssignedCourseTeacherModel(1, 2);
//                 expect.fail('Expected method to throw an error.');
//             } catch (error) {
//                 expect(error).to.be.an('error').and.have.property('message', 'Insert error');
//             }
//         });
//     });
// });



// Load test data from JSON file
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, 'testData.json'), 'utf8'));

describe('CSV Course-Teacher Assignment', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                csvData: testData.csvData
            }
        };
        
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(db, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('uploadCSVAssignedCourseTeacher', () => {
        it('should process and respond with success for all records', async () => {
            db.query
                .onFirstCall().callsArgWith(2, null, []) // First record - no existing course, insert
                .onSecondCall().callsArgWith(2, null, []) // Second record - no existing course, insert
                .onThirdCall().callsArgWith(2, null, []) // Third record - no existing course, insert
                .onCall(3).callsArgWith(2, null, { affectedRows: 1 }) // Insert success for first record
                .onCall(4).callsArgWith(2, null, { affectedRows: 1 }) // Insert success for second record
                .onCall(5).callsArgWith(2, null, { affectedRows: 1 }); // Insert success for third record

            await uploadCSVAssignedCourseTeacher(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match({ message: 'All records processed successfully' }))).to.be.true;
        });

        it('should handle errors and respond with failure', async () => {
            const mockError = new Error('Database error');
            db.query.callsArgWith(2, mockError);

            req.body.csvData = testData.errorData;

            await uploadCSVAssignedCourseTeacher(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match({ message: 'Error processing records' }))).to.be.true;
        });
    });

    describe('uploadCSVAssignedCourseTeacherModel', () => {
        it('should insert a new course-teacher assignment if no existing record', async () => {
            db.query
                .onFirstCall().callsArgWith(2, null, []) // No existing record found
                .onSecondCall().callsArgWith(2, null, { affectedRows: 1 }); // Insert successful

            const result = await uploadCSVAssignedCourseTeacherModel(1, 3);

            expect(result).to.deep.equal({ message: 'New course-teacher assignment added', results: { affectedRows: 1 } });
        });

        it('should update existing course-teacher assignment if record exists', async () => {
            db.query
                .onFirstCall().callsArgWith(2, null, [{ course_id: 1, teacher_id: 2 }]) // Existing record found
                .onSecondCall().callsArgWith(2, null, { affectedRows: 1 }); // Update successful

            const result = await uploadCSVAssignedCourseTeacherModel(1, 3);

            expect(result).to.deep.equal({ message: 'Teacher updated for existing course', results: { affectedRows: 1 } });
        });

        it('should handle errors during insert operation', async () => {
            const mockError = new Error('Insert error');
            db.query.onFirstCall().callsArgWith(2, null, []).onSecondCall().callsArgWith(2, mockError);

            try {
                await uploadCSVAssignedCourseTeacherModel(1, 3);
                expect.fail('Expected method to throw an error.');
            } catch (error) {
                expect(error).to.be.an('error').and.have.property('message', 'Insert error');
            }
        });

        it('should handle errors during update operation', async () => {
            const mockError = new Error('Update error');
            db.query.onFirstCall().callsArgWith(2, null, [{ course_id: 1, teacher_id: 2 }]).onSecondCall().callsArgWith(2, mockError);

            try {
                await uploadCSVAssignedCourseTeacherModel(1, 3);
                expect.fail('Expected method to throw an error.');
            } catch (error) {
                expect(error).to.be.an('error').and.have.property('message', 'Update error');
            }
        });
    });
});