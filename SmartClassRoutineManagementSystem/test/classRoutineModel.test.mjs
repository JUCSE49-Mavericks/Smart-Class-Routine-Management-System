// Import necessary modules
import chai from 'chai';
import assert from 'assert';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import pool from '../config/db.js';  // Adjust the path if necessary
import ClassRoutineModel from '../models/classRoutineModel.js';  // Adjust the path

chai.use(chaiAsPromised);
const { expect } = chai;

describe('ClassRoutineModel', () => {
    let queryStub;

    beforeEach(() => {
        // Stub the pool.query method
        queryStub = sinon.stub(pool, 'query');
    });

    afterEach(() => {
        // Restore the stub after each test
        sinon.restore();
    });

    describe('insertRoutineEntry', () => {
        it('should insert a routine entry into the database', async () => {
            // Arrange
            const entry = {
                Dept_id: 1,
                Teacher_id: 2,
                teacher_name: 'John Doe',
                day: 'Monday',
                class: '1st Year',
                time: { start: '10:00', end: '11:00' },
                course_title: 'Mathematics',
                room: 'Room 101',
            };

            queryStub.callsFake((query, params, callback) => {
                callback(null, { insertId: 1 }); // Simulate successful insertion
            });

            // Act
            await ClassRoutineModel.insertRoutineEntry(entry);

            // Assert
            expect(queryStub.calledOnce).to.be.true;
            expect(queryStub.firstCall.args[0]).to.include('INSERT INTO classRoutine');
            expect(queryStub.firstCall.args[1]).to.deep.equal([
                entry.Dept_id,
                entry.Teacher_id,
                entry.teacher_name,
                entry.day,
                entry.class,
                entry.time.start,
                entry.time.end,
                entry.course_title,
                entry.room,
            ]);
        });

        it('should handle errors during insertion', async () => {
            // Arrange
            const entry = {
                Dept_id: 1,
                Teacher_id: 2,
                teacher_name: 'John Doe',
                day: 'Monday',
                class: '1st Year',
                time: { start: '10:00', end: '11:00' },
                course_title: 'Mathematics',
                room: 'Room 101',
            };

            queryStub.callsFake((query, params, callback) => {
                callback(new Error('Database insertion failed'), null); // Simulate an error
            });

           
        });



      
    });
});
