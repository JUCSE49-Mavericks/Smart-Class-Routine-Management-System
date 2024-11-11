const MakeupScheduleModel = require('../models/makeupclassRoutineModel');

// Updated validDays array excluding Friday and Saturday
const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"];
const theoryRooms = ["101", "102", "103"];
const labRooms = ["203", "302"];
const validRooms = ["101", "102", "103", "203", "201", "302"];

const MakeupScheduleController = {
  generateMakeupSchedule: async (req, res) => {
    try {
      const { courseName, teacherName, preferredTimes, preferredDays, preferredRoom } = req.body;

      // Validate course name and teacher name
      if (!courseName || !teacherName) {
        return res.status(400).json({ message: 'Course name and teacher name are required' });
      }

      // Get classes needed from the model
      const classesNeeded = await MakeupScheduleModel.getClassesNeeded(courseName);
      if (classesNeeded === 0) {
        return res.status(200).json({ message: 'No makeup classes needed', schedule: [] });
      }
      if (classesNeeded === "error") {
        return res.status(400).json({ message: 'Routine cannot be generated as classesNeeded is not found', schedule: [] });
      }
      
      // Fetch courseType based on courseName
      const courseType = await MakeupScheduleModel.getCourseTypeByCourseName(courseName);
      if (courseType === null) {
        return res.status(404).json({ message: 'Course type not found' });
      }

      // Validate preferred room type
      if (preferredRoom && typeof preferredRoom !== 'string' && !Array.isArray(preferredRoom)) {
        return res.status(400).json({ message: 'Preferred room must be a string or an array of strings' });
      }

      // If preferredRoom is provided, validate it
      if (preferredRoom) {
        const invalidRooms = Array.isArray(preferredRoom) 
          ? preferredRoom.filter(room => !validRooms.includes(room)) 
          : !validRooms.includes(preferredRoom);
        
        if (invalidRooms.length > 0) {
          return res.status(400).json({ message: 'Invalid preferred room(s) provided' });
        }
      }

      // Handle preferred days
      let daysToAssign = preferredDays || [];
      if (preferredDays && preferredDays.length > 0) {
        const invalidDays = preferredDays.filter(day => !validDays.includes(day));
        if (invalidDays.length > 0) {
          return res.status(400).json({ message: 'Invalid preferred day(s) provided' });
        }
        daysToAssign = preferredDays;
      } else {
        let dayIndex = 0;
        daysToAssign = Array(classesNeeded).fill().map(() => validDays[dayIndex++ % validDays.length]);
      }

      // Default preferred times if not provided
      const times = (preferredTimes && Array.isArray(preferredTimes) && preferredTimes.length > 0) 
        ? preferredTimes 
        : [{ start: "09:00", end: "10:00" }];

      if (times.some(time => !time.start || !time.end)) {
        return res.status(400).json({ message: 'Invalid preferred time(s)' });
      }

      // Create the schedule
      const schedule = [];

      // Function to select classroom based on course type
      function selectClassroom(courseType) {
        if (courseType === "Theory") {
          return theoryRooms[Math.floor(Math.random() * theoryRooms.length)];
        } else if (courseType === "Lab") {
          return labRooms[Math.floor(Math.random() * labRooms.length)];
        }
        return 'Default Room';
      }

      // If preferredRoom is not provided, pick from default based on courseType
      let room = preferredRoom;
      if (!room || (Array.isArray(room) && room.length === 0)) {
        room = selectClassroom(courseType);
      }

      // Generate the time slots and assign classrooms
      times.forEach((timeSlot) => {
        const { start, end } = timeSlot;
        const startTime = start || "09:00";
        const endTime = end || getOneHourLater(startTime);

        for (let i = 0; i < classesNeeded; i++) {
          const day = daysToAssign[i % daysToAssign.length];
          schedule.push({
            day: day,
            time: `${startTime} - ${endTime}`,
            room: room
          });
        }
      });

      return res.status(200).json({
        message: 'Makeup schedule generated successfully',
        schedule
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to generate makeup schedule due to server error' });
    }
  }
};

/**
 * Helper function to get one hour later from a given time in HH:MM format.
 * @param {string} time - The time in HH:MM format.
 * @returns {string} The time one hour later in HH:MM format.
 */
function getOneHourLater(time) {
  const [hours, minutes] = time.split(':').map(Number);
  let newHours = hours + 1;
  if (newHours === 24) {
    newHours = 0;
  }
  return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

module.exports = MakeupScheduleController;
