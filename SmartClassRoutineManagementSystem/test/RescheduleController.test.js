// RescheduleController.test.mjs
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // Ensure this is the correct path to your Express app
import { getPendingRequests, approveRescheduleRequest, rejectRescheduleRequest } from '../controllers/RescheduleController';
import db from '../config/db.js'; // Ensure the path is correct

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('Reschedule Controller Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset sinon mocks after each test
    });

    describe('fetchPendingRequests', () => {
        it('should fetch pending requests successfully', async () => {
            const mockRequests = [
                {
                    reschedule_request_id: 3,
                    course_id: 2,
                    Course_code: "ENG201",
                    Course_title: "Advanced English Composition",
                    original_time: "2024-11-16 10:00:00",
                    requested_time: "2024-11-21 14:00:00",
                    new_time: [null],
                    reason: "Classroom not available",
                    status: "pending"
                },
                {
                    reschedule_request_id: 4,
                    course_id: 3,
                    Course_code: "VIVA-350",
                    Course_title: "Viva-Voca",
                    original_time: "2024-11-17 08:00:00",
                    requested_time: "2024-11-22 09:00:00",
                    new_time: [null],
                    reason: "Student conflict",
                    status: "pending"
                },
                {
                    reschedule_request_id: 5,
                    course_id: 2,
                    Course_code: "ENG201",
                    Course_title: "Advanced English Composition",
                    original_time: "2024-11-18 11:00:00",
                    requested_time: "2024-11-23 13:00:00",
                    new_time: [null],
                    reason: "Instructor ill",
                    status: "pending"
                },
                {
                    reschedule_request_id: 6,
                    course_id: 2,
                    Course_code: "BIS 351",
                    Course_title: "Management and Accounting",
                    original_time: "2024-11-19 13:00:00",
                    requested_time: "2024-11-24 15:00:00",
                    new_time: [null],
                    reason: "Schedule conflict",
                    status: "pending"
                },
                {
                    reschedule_request_id: 7,
                    course_id: 2,
                    Course_code: "BIS 351",
                    Course_title: "Management and Accounting",
                    original_time: "2024-11-15 09:00:00",
                    requested_time: "2024-11-20 10:00:00",
                    new_time: [null],
                    reason: "Teacher unavailable",
                    status: "pending"
                }
                
            ];
            const dbQueryStub = sinon.stub(db, 'query').yields(null, mockRequests);

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await getPendingRequests(req, res);

            expect(res.status).to.have.been.calledWith(200);
            expect(res.send).to.have.been.calledWith(mockRequests);
            expect(dbQueryStub.calledOnce).to.be.true;
        });

        it('should return 500 on database error', async () => {
            const mockError = new Error('Database error');
            sinon.stub(db, 'query').yields(mockError, null);

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await getPendingRequests(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.send).to.have.been.calledWith('Failed to fetch pending requests.');
        });
    });

    describe('approveRescheduleRequest', () => {
        it('should approve a reschedule request', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 1 });

            await approveRescheduleRequest(req, res);

            expect(res.status).to.have.been.calledWith(200);
            expect(res.send).to.have.been.calledWith('Request approved successfully.');
        });

        it('should return 404 if request not found', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 0 });

            await approveRescheduleRequest(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.send).to.have.been.calledWith('Request not found.');
        });

        it('should return 500 on database error', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const mockError = new Error('Database error');
            sinon.stub(db, 'query').yields(mockError, null);

            await approveRescheduleRequest(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.send).to.have.been.calledWith('Failed to approve request.');
        });
    });

    describe('rejectRescheduleRequest', () => {
        it('should reject a reschedule request', async () => {
            const req = { params: { id: '2' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 1 });

            await rejectRescheduleRequest(req, res);

            expect(res.status).to.have.been.calledWith(200);
            expect(res.send).to.have.been.calledWith('Request rejected successfully.');
        });

        it('should return 404 if request not found', async () => {
            const req = { params: { id: '2' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            sinon.stub(db, 'query').yields(null, { affectedRows: 0 });

            await rejectRescheduleRequest(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.send).to.have.been.calledWith('Request not found.');
        });

        it('should return 500 on database error', async () => {
            const req = { params: { id: '2' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const mockError = new Error('Database error');
            sinon.stub(db, 'query').yields(mockError, null);

            await rejectRescheduleRequest(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.send).to.have.been.calledWith('Failed to reject request.');
        });
    });
});
