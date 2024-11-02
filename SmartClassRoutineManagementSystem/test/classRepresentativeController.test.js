// Import required modules

const chai = require('chai');
const sinon = require('sinon');
const db = require('../config/db'); // Adjust the path as needed
const { fetchClassRepresentativeByExamYearId} = require('../controllers/classRepresentativeController');
const { createClassRepresentativeTable, getClassRepresentativeByExamYearId } = require('../models/classRepresentativeModel')

const { expect } = chai;

// Group tests for createClassRepresentativeTable
describe('createClassRepresentativeTable', () => {
    let queryStub;

    // Set up the query stub before each test
    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
    });

    // Restore the original function after each test
    afterEach(() => {
        queryStub.restore();
    });

    it('should execute the query to create the ClassRepresentative table', (done) => {
        // Simulate successful execution by calling the callback with no error
        queryStub.callsFake((query, callback) => {
            callback(null, { message: 'Success' });
        });

        // Call the function
        createClassRepresentativeTable();

        // Assertions
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include('CREATE TABLE IF NOT EXISTS ClassRepresentative');
        
        done();
    });

    it('should handle an error during table creation', (done) => {
        // Simulate an error
        const error = new Error('Database error');
        queryStub.callsFake((query, callback) => {
            callback(error);
        });

        try {
            createClassRepresentativeTable();
        } catch (err) {
            // Assertions
            expect(err).to.equal(error);
            expect(queryStub.calledOnce).to.be.true;
            expect(queryStub.firstCall.args[0]).to.include('CREATE TABLE IF NOT EXISTS ClassRepresentative');
        }
        
        done();
    });
});


describe('fetchClassRepresentativeByExamYearId', () => {
    let req, res;
    let queryStub;

    // Set up request and response mocks
    beforeEach(() => {
        req = {
            params: {
                exam_year_id: 2024 // Example exam year ID
            }
        };

        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        queryStub = sinon.stub(db, 'query'); // Stub the db.query method
    });

    // Restore the original function after each test
    afterEach(() => {
        queryStub.restore();
    });

    it('should return class representative data when found', async () => {
        // Arrange: Simulate successful database response
        const mockResults = [{ id: 1, name: 'John Doe', exam_year_id: 2024 }];
        queryStub.callsFake((query, params, callback) => {
            callback(null, mockResults);
        });

        // Act: Call the function
        await fetchClassRepresentativeByExamYearId(req, res);

        // Assert: Check that the response is correct
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(mockResults);
    });

    it('should return 404 when no class representative is found', async () => {
        // Arrange: Simulate an empty database response
        queryStub.callsFake((query, params, callback) => {
            callback(null, []);
        });

        // Act: Call the function
        await fetchClassRepresentativeByExamYearId(req, res);

        // Assert: Check that a 404 response is sent
        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.args[0]).to.equal(404);
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({ error: 'Class Representative not found' });
    });

    it('should return 500 when there is a database error', async () => {
        // Arrange: Simulate a database error
        const dbError = new Error('Database error');
        queryStub.callsFake((query, params, callback) => {
            callback(dbError);
        });

        // Act: Call the function
        await fetchClassRepresentativeByExamYearId(req, res);

        // Assert: Check that a 500 response is sent
        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.args[0]).to.equal(500);
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({ error: 'Database error' });
    });
});