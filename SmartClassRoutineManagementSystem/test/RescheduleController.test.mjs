
//test/RescheduleController.test.mjs
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import * as RescheduleController from '../controllers/RescheduleController.js';
import db from '../config/db.js';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('Reschedule Controller Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset Sinon mocks after each test
    });

    describe('fetchPendingRequests', () => {
        it('should fetch pending requests successfully', async () => {
            const mockRequests = [
                { id: 1, requestType: 'Reschedule', status: 'Pending' },
                { id: 2, requestType: 'Reschedule', status: 'Pending' },
            ];
            const dbQueryStub = sinon.stub(db, 'query').yields(null, mockRequests);

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await RescheduleController.fetchPendingRequests(req, res);

            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith(mockRequests);
            expect(dbQueryStub.calledOnce).to.be.true;
        });

        it('should return 500 on database error', async () => {
            const mockError = new Error('Database error');
            sinon.stub(db, 'query').yields(mockError, null);

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await RescheduleController.fetchPendingRequests(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: 'Failed to fetch pending requests.' });
        });
    });

    describe('approveRequest', () => {
        it('should approve a reschedule request successfully', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 1 });

            await RescheduleController.approveRequest(req, res);

            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith({ message: 'Request approved successfully.' });
        });

        it('should return 404 if request not found', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 0 });

            await RescheduleController.approveRequest(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ error: 'Request not found.' });
        });

        it('should return 500 on database error', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const mockError = new Error('Database error');
            sinon.stub(db, 'query').yields(mockError, null);

            await RescheduleController.approveRequest(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: 'Failed to approve request.' });
        });
    });

    describe('rejectRequest', () => {
        it('should reject a reschedule request successfully', async () => {
            const req = { params: { id: '2' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 1 });

            await RescheduleController.rejectRequest(req, res);

            expect(res.status).to.have.been.calledWith(200);
            expect(res.json).to.have.been.calledWith({ message: 'Request rejected successfully.' });
        });

        it('should return 404 if request not found', async () => {
            const req = { params: { id: '2' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 0 });

            await RescheduleController.rejectRequest(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ error: 'Request not found.' });
        });

        it('should return 500 on database error', async () => {
            const req = { params: { id: '2' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            const mockError = new Error('Database error');
            sinon.stub(db, 'query').yields(mockError, null);

            await RescheduleController.rejectRequest(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ error: 'Failed to reject request.' });
        });
    });
});
