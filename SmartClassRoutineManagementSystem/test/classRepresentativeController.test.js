// test/classRepresentativeController.test.js

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const { fetchClassRepresentativeByExamYearId } = require('../controllers/classRepresentativeController');
const { getClassRepresentativeByExamYearId } = require('../models/classRepresentativeModel');

//chai.use(require('chai-http'));

describe('Class Representative Controller', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { params: { exam_year_id: '2023' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return class representative data when found', async () => {
        // Mock data
        const mockResults = [{ id: 1, name: 'John Doe', exam_year_id: '2023' }];
        
        // Stub the model function to return mock data
        sandbox.stub(getClassRepresentativeByExamYearId).resolves(mockResults);

        // Call the controller function
        await fetchClassRepresentativeByExamYearId(req, res);

        // Assertions
        expect(res.json.calledOnceWith(mockResults)).to.be.true;
    });

    it('should return 404 when class representative not found', async () => {
        // Stub the model function to return an empty array
        sandbox.stub(getClassRepresentativeByExamYearId).resolves([]);

        // Call the controller function
        await fetchClassRepresentativeByExamYearId(req, res);

        // Assertions
        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWith({ error: 'Class Representative not found' })).to.be.true;
    });

    it('should return 500 and error message on database error', async () => {
        // Stub the model function to throw an error
        sandbox.stub(getClassRepresentativeByExamYearId).rejects(new Error('Database error'));

        // Call the controller function
        await fetchClassRepresentativeByExamYearId(req, res);

        // Assertions
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWith({ error: 'Database error' })).to.be.true;
    });
});
