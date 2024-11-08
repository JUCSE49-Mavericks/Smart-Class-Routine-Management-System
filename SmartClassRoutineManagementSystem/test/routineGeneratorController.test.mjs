import { expect } from 'chai';
import { strict as assert } from 'assert'; 
import RoutineGenerateController from '../controllers/ROUTINE/routineGeneratorController.js'; // Adjust the path if needed


import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Load mock data from JSON file
const mockDataPath = join(__dirname, '../testCases/testCases1.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

describe('RoutineGenerateController - generateRoutine', () => {
    
        /** @type {RoutineGenerateController} */

    let routineGenerateController;
    

    /**
     * Test case to verify correct mapping of preferred times for teachers.
     */
    it('should map preferred times for teachers correctly', () => {
        console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
        const routineGenController = new RoutineGenerateController();


        // Use teacherDetails from the mock data
        const teacherDetails = mockData.teacherDetails;


        // Act
        const result = routineGenController.mapPreferredTimes(teacherDetails);


        // Log the entire result for inspection
        console.log("Mapped preferred times result:", JSON.stringify(result, null, 2));


        // Assert and print custom messages
        console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
        console.log("Testing allocation within preferred time ranges for Teacher 1...");


        // Sunday check: preferred time exists
        assert.ok(result[1].Sunday.some(slot => isWithinTimeRange(slot.start, slot.end, '10:00', '11:00')), 'Expected a valid slot on Sunday');


        // Monday check: preferred time exists
        assert.ok(result[1].Monday.some(slot => isWithinTimeRange(slot.start, slot.end, '11:00', '13:00')), 'Expected a valid slot on Monday');


        // Tuesday check: no preferred time
        assert.deepEqual(result[1].Tuesday, [], 'Expected no preferred time on Tuesday');


        // Wednesday check: preferred time exists
        assert.ok(result[1].Wednesday.some(slot => isWithinTimeRange(slot.start, slot.end, '12:00', '13:00')), 'Expected a valid slot on Wednesday');


        // Thursday check: preferred time exists
        assert.ok(result[1].Thursday.some(slot => isWithinTimeRange(slot.start, slot.end, '14:00', '15:00')), 'Expected a valid slot on Thursday');
        console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    });















    
    // Sample mock data
    const mockScheduleData = {
        slots: [
            { startTime: '09:00', endTime: '10:00' },
            { startTime: '10:00', endTime: '11:00' },
        ],
    };

    const mockDepartmentData = {
        deptId: 1,
        teacherDetails: [
            {
                teacher_id: 1,
                Name: 'John Doe',
                preferredTimes: [
                    { start: '09:00', end: '10:00' }, // Sunday preferred time
                ],
            },
            
        ],
        courses: [
            {
                course_id: 101,
                course_title: 'OS',
                teacher_id: 1,
                classes_per_week: 2, // Updated to indicate 2 classes per week
                slots: 2, // Indicates a course that occupies 2 slots
                room_type: 'Lab',
                class: 'A',
            },
        ],
        departmentName: 'Science',
    };

    const mockClassroomDetails = [
        {
            room_type: 'Lab',
            room_count: 2,
            Rooms: ['203', '302'],
        },
    ];

    // Initialize the controller before each test
    beforeEach(() => {
        routineGenerateController = new RoutineGenerateController();
    });


    /**
     * Test case to verify assignment of consecutive slots for courses that require multiple slots.
     */

    // it('should assign consecutive slots for a 2-slot course', async () => {
    //     console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    //     // Arrange
    //     const scheduleData = {
    //         slots: [
    //             { startTime: '09:00', endTime: '10:00' },
    //             { startTime: '10:00', endTime: '11:00' },
    //             { startTime: '11:00', endTime: '12:00' }
    //         ]
    //     };

    //     const departmentData = {
    //         deptId: 1,
    //         departmentName: 'Computer Science & Engineering',
    //         teacherDetails: [
    //             { teacher_id: 1, Name: 'Dr. Md. Musfique Anwar' }
    //         ]
    //     };

    //     const classroomDetails = [
    //         { room_type: 'Lab', Rooms: ['203', '302'] }
    //     ];

    //     const routineGenController = new RoutineGenerateController();

    //     // Simulate the courses data with a 2-slot course
    //     const courses = [
    //         {
    //             course_id: 404,
    //             course_title: 'Software Engieering & ISD Lab',
    //             teacher_id: 1,
    //             classes_per_week: 1,
    //             class: '4-1',
    //             slots: 2 // 2-slot course
    //         }
    //     ];

    //     // Set the department data with courses
    //     departmentData.courses = courses;

    //     // Map preferred times for the teacher
    //     routineGenController.mapPreferredTimes = function (teacherDetails) {
    //         return {
    //             1: {
    //                 Thursday: [{ start: '09:00', end: '11:00' }] // Teacher prefers this time
    //             }
    //         };
    //     };

    //     // Allocate rooms for the course
    //     routineGenController.allocateRooms = function (courses, classroomDetails) {
    //         return {
    //             404: '203' // Allocate Lab1 for Algorithms course
    //         };
    //     };

    //     // Act
    //     const routine = await routineGenController.generateRoutine(scheduleData, departmentData, classroomDetails);

    //     // Assert
    //     const allocatedClasses = routine.filter(entry => entry.course_id === 404);
    //     assert.equal(allocatedClasses.length, 2, 'Two classes should be allocated for the course');
    //     assert.deepEqual(allocatedClasses[0].time, { start: '09:00', end: '10:00' }, 'First class time should be 09:00 to 10:00');
    //     assert.deepEqual(allocatedClasses[1].time, { start: '10:00', end: '11:00' }, 'Second class time should be 10:00 to 11:00');
    //     assert.equal(allocatedClasses[0].room, '203', 'First class should be assigned to LaB 203');
    //     assert.equal(allocatedClasses[1].room, '203', 'Second class should also be assigned to Lab 203');
    //     console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    // });
    

    /**
     * Test case to verify that courses are skipped if no preferred times are set.
     */

    // it('should skip a course from allocating on that day if no preferred times are available for the course TEACHER i.e preferred time is NULL', async () => {
    //     console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    //     const modifiedDepartmentData = {
    //         ...mockDepartmentData,
    //         teacherDetails: [
    //             {
    //                 teacher_id: 1,
    //                 Name: 'Dr. Md. Musfique Anwar',
    //                 preferredTimes: [], // No preferred times
    //             },
    //         ],
    //     };

    //     const routine = await routineGenerateController.generateRoutine(
    //         mockScheduleData,
    //         modifiedDepartmentData,
    //         mockClassroomDetails
    //     );

    //     expect(routine).to.be.an('array').that.is.empty; // No routine generated due to lack of preferred times
    //     console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    // });




  
    /**
     * Test case to verify that a teacher is not assigned to different classes at the same time slot.
     */
    // it('should handle cases so that the same TEACHER is not assigned to two different classes at the same TIME SLOT', async () => {
    //     console.log('---------------------------------------------------------------------------------------------------------------------------------------------');
    //     const modifiedDepartmentData = {
    //         deptId: 1,
    //         teacherDetails: [
    //             {
    //                 teacher_id: 1,
    //                 Name: 'Dr. Md. Musfique Anwar',
    //                 preferredTimes: [{ start: '09:00', end: '10:00' }],
    //             },
    //         ],
    //         courses: [
    //             {
    //                 course_id: 404,
    //                 course_title: 'Software Engineering & ISD Lab',
    //                 teacher_id: 1,
    //                 classes_per_week: 1,
    //                 slots: 1,
    //                 room_type: 'Lab',
    //                 class: '4-1',
    //             },
    //             {
    //                 course_id: 312,
    //                 course_title: 'OOAD',
    //                 teacher_id: 1,
    //                 classes_per_week: 1,
    //                 slots: 1,
    //                 room_type: 'Lab',
    //                 class: '3-1',
    //             },
    //         ],
    //         departmentName: 'CSE',
    //     };

    //     const routine = await routineGenerateController.generateRoutine(
    //         mockScheduleData,
    //         modifiedDepartmentData,
    //         mockClassroomDetails
    //     );
    //     modifiedDepartmentData.teacherDetails.forEach((teacher) => {
    //         console.log(`Teacher ID: ${teacher.teacher_id}`);
    //         console.log(`Name: ${teacher.Name}`);
            
    //         // Loop through each preferred time for this teacher
    //         teacher.preferredTimes.forEach((time, index) => {
    //             console.log(`Preferred Time ${index + 1}: Start - ${time.start}, End - ${time.end}`);
    //         });
    //     });
     
    //     console.log(modifiedDepartmentData.courses);

    //     // Expecting a single class to be assigned due to time conflicts
    //     expect(routine).to.be.an('array').that.has.lengthOf(1);
    //     expect(routine[0]).to.include({ teacher_id: 1, course_title: 'Software Engineering & ISD Lab' }); 
    //     console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    // });




    



    // it('should handle cases with multiple teachers and courses', async () => {
    //     console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    //     const modifiedDepartmentData = {
    //         deptId: 1,
    //         teacherDetails: [
    //             {
    //                 teacher_id: 1,
    //                 Name: 'John Doe',
    //                 preferredTimes: [{ start: '09:00', end: '10:00' }],
    //             },
    //             {
    //                 teacher_id: 2,
    //                 Name: 'Jane Smith',
    //                 preferredTimes: [{ start: '09:00', end: '11:00' }],
    //             },
    //         ],
    //         courses: [
    //             {
    //                 course_id: 101,
    //                 course_title: 'OS',
    //                 teacher_id: 1,
    //                 classes_per_week: 1,
    //                 slots: 1, 
    //                 room_type: 'Lab',
    //                 class: 'A',
    //             },
    //             {
    //                 course_id: 102,
    //                 course_title: 'DS',
    //                 teacher_id: 2,
    //                 classes_per_week: 1,
    //                 slots: 1, 
    //                 room_type: 'Lab',
    //                 class: 'B',
    //             },
    //         ],
    //         departmentName: 'Science',
    //     };

    //     const routine = await routineGenerateController.generateRoutine(
    //         mockScheduleData,
    //         modifiedDepartmentData,
    //         mockClassroomDetails
    //     );

    //     // Expecting both teachers to be assigned classes
    //     expect(routine).to.be.an('array').that.has.lengthOf(2);
    //     expect(routine[0]).to.include({ teacher_id: 1, course_title: 'OS' });
    //     expect(routine[1]).to.include({ teacher_id: 2, course_title: 'DS' });
    //     console.log('-------------------------------------------------------------------------------------------------------------------');
    // });

   
});

/**
 * Helper function to check if a time slot falls within a preferred time range.
 *
 * @param {string} startTime - The start time of the slot.
 * @param {string} endTime - The end time of the slot.
 * @param {string} preferredStart - The preferred start time.
 * @param {string} preferredEnd - The preferred end time.
 * @returns {boolean} - True if the slot is within the preferred time range, false otherwise.
 */

// Helper function to check if a time slot falls within a preferred time range
function isWithinTimeRange(startTime, endTime, preferredStart, preferredEnd) {
    return (
        (startTime >= preferredStart && startTime < preferredEnd) ||
        (endTime > preferredStart && endTime <= preferredEnd) ||
        (startTime <= preferredStart && endTime >= preferredEnd) ||
        (startTime >= preferredStart && endTime <= preferredEnd)
    );
}