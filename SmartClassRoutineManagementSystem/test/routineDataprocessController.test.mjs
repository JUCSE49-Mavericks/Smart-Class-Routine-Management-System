import { expect } from 'chai';
import sinon from 'sinon';
import pool from '../config/db.js'; // Use .js for ESM import
import DataProcessController from '../controllers/ROUTINE/routineDataProcessController.js';

describe('DataProcessController', function () {
    let controller;
    let queryStub;

    beforeEach(() => {
        controller = new DataProcessController();
        queryStub = sinon.stub(pool, 'query'); // Stub the database query
    });

    afterEach(() => {
        sinon.restore(); // Restore all stubs/mocks to avoid side effects
    });

    it('should retrieve assigned courses for a valid teacher ID', async function () {
        const teacherId = 1; // Example teacher ID
        const mockCourses = [{ course_id: 101 }, { course_id: 102 }]; // Mock assigned courses
        queryStub.yields(null, mockCourses); // Mock query result
    
        const courseIds = await controller.getAssignedCourses(teacherId);
        expect(courseIds).to.deep.equal([101, 102]);
    });

    it('should retrieve the department ID for a valid department name', async function () {
        const mockResult = [{ dept_id: 1 }];
        queryStub.yields(null, mockResult); // Mock query result

        const deptId = await controller.getDepartmentId('Computer Science');
        expect(deptId).to.equal(1);
    });

    it('should return null for an invalid department name', async function () {
        queryStub.yields(null, []); // Simulate no results found

        const deptId = await controller.getDepartmentId('Invalid Department');
        expect(deptId).to.be.null;
    });



    it('should retrieve teacher details by department ID', async function () {
        this.timeout(5000);
        const mockTeachers = [
            { teacher_id: 1, Name: 'John Doe' },
            { teacher_id: 2, Name: 'Jane Doe' },
        ];
        queryStub.yields(null, mockTeachers); // Mock query response

        const teachers = await controller.getTeacherDetailsByDepartmentId(2);
        expect(teachers).to.be.an('array').with.length(2);
        expect(teachers[0]).to.have.property('Name', 'John Doe');
    });



    it('should handle empty results gracefully when no teachers are found', async function () {
        queryStub.yields(null, []); // No teachers found

        const teachers = await controller.getTeacherDetailsByDepartmentId(1);
        expect(teachers).to.be.an('array').that.is.empty;
    });

 
});
