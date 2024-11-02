const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const { fetchClassRepresentativeByExamYearId } = require('../controllers/classRepresentativeController');
const classRepresentativeModel = require('../models/classRepresentativeModel'); // Import model for stubbing

// Mock response and request objects
function mockRes() {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
}

describe('classRepresentativeController', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('fetchClassRepresentativeByExamYearId', () => {
        it('should return class representative data when found', async () => {
            const req = { params: { exam_year_id: 1 } };
            const res = mockRes();
            const sampleData = [{ cr_id: 2, student_id: 1, role: 'Male', exam_year_id: 1 }];

            sinon.stub(classRepresentativeModel, 'getClassRepresentativeByExamYearId').resolves(sampleData);

            await fetchClassRepresentativeByExamYearId(req, res);

            expect(res.status.called).to.be.false; // 200 OK
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(sampleData); // Match data structure exactly
        });

        it('should return a 404 error if no class representative is found', async () => {
            const req = { params: { exam_year_id: 5 } };
            const res = mockRes();

            sinon.stub(classRepresentativeModel, 'getClassRepresentativeByExamYearId').resolves([]);

            await fetchClassRepresentativeByExamYearId(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'Class Representative not found' })).to.be.true;
        });

        // it('should return a 500 error if there is a database error', async () => {
        //     const req = { params: { exam_year_id: 10 } };
        //     const res = mockRes();
        
        //     // Stub the model method to reject with an error to simulate a database error
        //     sinon.stub(classRepresentativeModel, 'getClassRepresentativeByExamYearId').rejects(new Error('Database error'));
        
        //     await fetchClassRepresentativeByExamYearId(req, res);
        
        //     // Check if status(500) and json({ error: 'Database error' }) were called correctly
        //     expect(res.status.calledOnceWith(500)).to.be.true;
        //     expect(res.json.calledOnceWith({ error: 'Database error' })).to.be.true;
        // });
    });
});