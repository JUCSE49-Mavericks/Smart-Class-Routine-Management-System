const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const db = require('../db'); // Your database connection or ORM
const scheduledClassController = require('../controllers/scheduledClassController'); // The controller to be tested

describe('ScheduledClass Controller', function () {
    describe('confirmScheduledClass', function () {
        it('should confirm a scheduled class', function () {
            const classData = {
                scheduled_class_id: 1,
                status: 'Scheduled',
                class_date: '2024-11-07',
                startTime: '2024-11-07 10:00:00',
                confirmationTime: '2024-11-07 05:00:00'
            };

            const stub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                if (query.includes('UPDATE')) {
                    callback(null, { affectedRows: 1 });
                }
            });

            return scheduledClassController.confirmScheduledClass(classData)
                .then(result => {
                    expect(result.status).to.equal('Confirmed');
                    stub.restore();
                });
        });

        it('should not confirm a class if confirmation time is more than 5 hours before the class', function () {
            const classData = {
                scheduled_class_id: 1,
                status: 'Scheduled',
                class_date: '2024-11-07',
                startTime: '2024-11-07 10:00:00',
                confirmationTime: '2024-11-07 04:00:00'
            };

            const stub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                callback(null, { affectedRows: 0 });
            });

            return scheduledClassController.confirmScheduledClass(classData)
                .then(result => {
                    expect(result.status).to.equal('Scheduled');
                    stub.restore();
                });
        });

        it('should confirm a class exactly 5 hours before the start time', function () {
            const classData = {
                scheduled_class_id: 1,
                status: 'Scheduled',
                class_date: '2024-11-07',
                startTime: '2024-11-07 10:00:00',
                confirmationTime: '2024-11-07 05:00:00'
            };

            const stub = sinon.stub(db, 'query').callsFake((query, params, callback) => {
                if (query.includes('UPDATE')) {
                    callback(null, { affectedRows: 1 });
                }
            });

            return scheduledClassController.confirmScheduledClass(classData)
                .then(result => {
                    expect(result.status).to.equal('Confirmed');
                    stub.restore();
                });
        });

        it('should handle invalid class time (startTime > endTime)', function () {
            const classData = {
                scheduled_class_id: 1,
                status: 'Scheduled',
                class_date: '2024-11-07',
                startTime: '2024-11-07 10:00:00',
                endTime: '2024-11-07 09:00:00'
            };

            return scheduledClassController.validateClassTime(classData)
                .catch(err => {
                    expect(err.message).to.equal('Invalid class time');
                });
        });
    });
});
