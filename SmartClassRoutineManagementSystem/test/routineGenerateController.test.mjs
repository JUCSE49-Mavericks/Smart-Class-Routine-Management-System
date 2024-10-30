import { expect } from 'chai';
import { strict as assert } from 'assert'; 
import RoutineGenerateController from '../controllers/ROUTINE/routineGeneratorController.js'; // Adjust the path if needed




describe('RoutineGenerateController - generateRoutine', () => {
    let routineGenerateController;

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
                course_title: 'Mathematics',
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
            Rooms: ['Lab1', 'Lab2'],
        },
    ];

    // Initialize the controller before each test
    beforeEach(() => {
        routineGenerateController = new RoutineGenerateController();
    });





    

    it('should skip a course from allocating on that day if no preferred times are available for the course TEACHER i.e preferred time is NULL', async () => {
        console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
        const modifiedDepartmentData = {
            ...mockDepartmentData,
            teacherDetails: [
                {
                    teacher_id: 1,
                    Name: 'John Doe',
                    preferredTimes: [], // No preferred times
                },
            ],
        };

        const routine = await routineGenerateController.generateRoutine(
            mockScheduleData,
            modifiedDepartmentData,
            mockClassroomDetails
        );

        expect(routine).to.be.an('array').that.is.empty; // No routine generated due to lack of preferred times
        console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
    });




    it('should handle cases with multiple teachers and courses', async () => {
        console.log('----------------------------------------------------------------------------------------------------------------------------------------------');
        const modifiedDepartmentData = {
            deptId: 1,
            teacherDetails: [
                {
                    teacher_id: 1,
                    Name: 'John Doe',
                    preferredTimes: [{ start: '09:00', end: '10:00' }],
                },
                {
                    teacher_id: 2,
                    Name: 'Jane Smith',
                    preferredTimes: [{ start: '09:00', end: '11:00' }],
                },
            ],
            courses: [
                {
                    course_id: 101,
                    course_title: 'Mathematics',
                    teacher_id: 1,
                    classes_per_week: 1,
                    slots: 1, // Adjusting to single slot for single class
                    room_type: 'Lab',
                    class: 'A',
                },
                {
                    course_id: 102,
                    course_title: 'Physics',
                    teacher_id: 2,
                    classes_per_week: 1,
                    slots: 1, // Single class for physics as well
                    room_type: 'Lab',
                    class: 'B',
                },
            ],
            departmentName: 'Science',
        };

        const routine = await routineGenerateController.generateRoutine(
            mockScheduleData,
            modifiedDepartmentData,
            mockClassroomDetails
        );

        // Expecting both teachers to be assigned classes
        expect(routine).to.be.an('array').that.has.lengthOf(2);
        expect(routine[0]).to.include({ teacher_id: 1, course_title: 'Mathematics' });
        expect(routine[1]).to.include({ teacher_id: 2, course_title: 'Physics' });
        console.log('-------------------------------------------------------------------------------------------------------------------');
    });

    it('should handle cases so that the same TEACHER is not assigned to two different classes at the same TIME SLOT', async () => {
        console.log('-------------------------------------------------------------------------------------------------------------------');
        const modifiedDepartmentData = {
            deptId: 1,
            teacherDetails: [
                {
                    teacher_id: 1,
                    Name: 'John Doe',
                    preferredTimes: [{ start: '09:00', end: '10:00' }],
                },
            ],
            courses: [
                {
                    course_id: 101,
                    course_title: 'Mathematics',
                    teacher_id: 1,
                    classes_per_week: 1,
                    slots: 1,
                    room_type: 'Lab',
                    class: 'A',
                },
                {
                    course_id: 102,
                    course_title: 'Physics',
                    teacher_id: 1,
                    classes_per_week: 1,
                    slots: 1,
                    room_type: 'Lab',
                    class: 'B',
                },
            ],
            departmentName: 'Science',
        };

        const routine = await routineGenerateController.generateRoutine(
            mockScheduleData,
            modifiedDepartmentData,
            mockClassroomDetails
        );

        // Expecting a single class to be assigned due to time conflicts
        expect(routine).to.be.an('array').that.has.lengthOf(1);
        expect(routine[0]).to.include({ teacher_id: 1, course_title: 'Mathematics' }); // Assuming it prioritizes Mathematics
        console.log('-----------------------------------------------------------------------------------------------------------------');
    });


    it('should assign consecutive slots for a 2-slot course', async () => {
        console.log('-------------------------------------------------------------------------------------------------------------------');
        // Arrange
        const scheduleData = {
            slots: [
                { startTime: '09:00', endTime: '10:00' },
                { startTime: '10:00', endTime: '11:00' },
                { startTime: '11:00', endTime: '12:00' }
            ]
        };

        const departmentData = {
            deptId: 1,
            departmentName: 'Computer Science',
            teacherDetails: [
                { teacher_id: 1, Name: 'John Doe' }
            ]
        };

        const classroomDetails = [
            { room_type: 'Lab', Rooms: ['Lab1', 'Lab2'] }
        ];

        const routineGenController = new RoutineGenerateController();

        // Simulate the courses data with a 2-slot course
        const courses = [
            {
                course_id: 101,
                course_title: 'Algorithms',
                teacher_id: 1,
                classes_per_week: 1,
                class: '1A',
                slots: 2 // 2-slot course
            }
        ];

        // Set the department data with courses
        departmentData.courses = courses;

        // Map preferred times for the teacher
        routineGenController.mapPreferredTimes = function (teacherDetails) {
            return {
                1: {
                    Monday: [{ start: '09:00', end: '11:00' }] // Teacher prefers this time
                }
            };
        };

        // Allocate rooms for the course
        routineGenController.allocateRooms = function (courses, classroomDetails) {
            return {
                101: 'Lab1' // Allocate Lab1 for Algorithms course
            };
        };

        // Act
        const routine = await routineGenController.generateRoutine(scheduleData, departmentData, classroomDetails);

        // Assert
        const allocatedClasses = routine.filter(entry => entry.course_id === 101);
        assert.equal(allocatedClasses.length, 2, 'Two classes should be allocated for the course');
        assert.deepEqual(allocatedClasses[0].time, { start: '09:00', end: '10:00' }, 'First class time should be 09:00 to 10:00');
        assert.deepEqual(allocatedClasses[1].time, { start: '10:00', end: '11:00' }, 'Second class time should be 10:00 to 11:00');
        assert.equal(allocatedClasses[0].room, 'Lab1', 'First class should be assigned to Lab1');
        assert.equal(allocatedClasses[1].room, 'Lab1', 'Second class should also be assigned to Lab1');
        console.log('-----------------------------------------------------------------------------');
      
    });


    
    it('should map preferred times for teachers correctly', () => {
        // Arrange
        console.log('-----------------------------------------------------------------------------');
        const routineGenController = new RoutineGenerateController();
        const teacherDetails = [
            {
                teacher_id: 1,
                preferredTimes: [
                    { start: '09:00', end: '12:00' }, // Sunday
                    { start: '10:00', end: '13:00' }, // Monday
                    null,                             // Tuesday
                    { start: '09:00', end: '13:00' }, // Wednesday
                    { start: '13:00', end: '15:00' }  // Thursday
                ]
            }
        ];
    
        // Act
        const result = routineGenController.mapPreferredTimes(teacherDetails);
    
        // Log the entire result for inspection
        console.log("Mapped preferred times result:", JSON.stringify(result, null, 2));
    
        // Assert and print custom messages
        console.log('-------------------------------------------------------------------------------');
        console.log("Testing allocation within preferred time ranges for Teacher 1...");
    
        // Sunday check: preferred time exists
        if (result[1].Sunday.some(slot => isWithinTimeRange(slot.start, slot.end, '10:00', '11:00'))) {
            console.log('It’s OK to allocate a slot for Teacher 1 on Sunday from 10:00 to 11:00');
        } else {
            console.error('Slot on Sunday from 10:00 to 11:00 is not within preferred time');
        }
        assert.ok(result[1].Sunday.some(slot => 
            isWithinTimeRange(slot.start, slot.end, '10:00', '11:00')));
    
        // Monday check: preferred time exists
        if (result[1].Monday.some(slot => isWithinTimeRange(slot.start, slot.end, '11:00', '13:00'))) {
            console.log('It’s OK to allocate a slot for Teacher 1 on Monday from 11:00 to 13:00');
        } else {
            console.error('Slot on Monday from 11:00 to 13:00 is not within preferred time');
        }
        assert.ok(result[1].Monday.some(slot => 
            isWithinTimeRange(slot.start, slot.end, '11:00', '13:00')));
    
        // Tuesday check: no preferred time
        if (result[1].Tuesday.length === 0) {
            console.log('Teacher 1 should not be allocated any slot on Tuesday');
        } else {
            console.error('Teacher 1 has a preferred time on Tuesday when there should be none');
        }
        assert.deepEqual(result[1].Tuesday, []);
    
        // Wednesday check: preferred time exists
        if (result[1].Wednesday.some(slot => isWithinTimeRange(slot.start, slot.end, '12:00', '13:00'))) {
            console.log('It’s OK to allocate a slot for Teacher 1 on Wednesday from 12:00 to 13:00');
        } else {
            console.error('Slot on Wednesday from 12:00 to 13:00 is not within preferred time');
        }
        assert.ok(result[1].Wednesday.some(slot => 
            isWithinTimeRange(slot.start, slot.end, '12:00', '13:00')));
    
        // Thursday check: preferred time exists
        if (result[1].Thursday.some(slot => isWithinTimeRange(slot.start, slot.end, '14:00', '15:00'))) {
            console.log('It’s OK to allocate a slot for Teacher 1 on Thursday from 14:00 to 15:00');
        } else {
            console.error('Slot on Thursday from 14:00 to 15:00 is not within preferred time');
        }
        assert.ok(result[1].Thursday.some(slot => 
            isWithinTimeRange(slot.start, slot.end, '14:00', '15:00')));
            console.log('-------------------------------------------------------------------------------');
    });
    


   
});

// Helper function to check if a time slot falls within a preferred time range
function isWithinTimeRange(startTime, endTime, preferredStart, preferredEnd) {
    return (
        (startTime >= preferredStart && startTime < preferredEnd) ||
        (endTime > preferredStart && endTime <= preferredEnd) ||
        (startTime <= preferredStart && endTime >= preferredEnd) ||
        (startTime >= preferredStart && endTime <= preferredEnd)
    );
}