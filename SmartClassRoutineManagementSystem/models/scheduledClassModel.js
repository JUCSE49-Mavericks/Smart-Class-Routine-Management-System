// models/scheduledClassModel.js

const db = require('../config/db');

/**
 * Creates the TimeSlot table in the database if it doesn't already exist.
 */
function createTimeSlotTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS TimeSlot (
            time_slot_id INT AUTO_INCREMENT PRIMARY KEY,
            startTime TIME NOT NULL,
            endTime TIME NOT NULL
        );
    `;

    db.query(createTableQuery, (error, results) => {
        if (error) {
            console.error('Error creating TimeSlot table:', error);
            return;
        }
        console.log('TimeSlot table created successfully.');
    });
}

/**
 * Creates the ScheduledClass table in the database if it doesn't already exist.
 */
function createScheduledClassTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ScheduledClass (
            scheduled_class_id INT AUTO_INCREMENT PRIMARY KEY,
            class_date DATE NOT NULL,
            course_id INT,
            teacher_id INT,
            time_slot_id INT,
            room_id INT,
            status ENUM('Scheduled', 'Confirmed', 'Cancelled', 'Conducted') NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id),
            FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id),
            FOREIGN KEY (time_slot_id) REFERENCES TimeSlot(time_slot_id),
            FOREIGN KEY (room_id) REFERENCES Room(room_id)
        );
    `;

    db.query(createTableQuery, (error, results) => {
        if (error) {
            console.error('Error creating ScheduledClass table:', error);
            return;
        }
        console.log('ScheduledClass table created successfully.');
    });
}

/**
 * Fetches all scheduled classes for a specific teacher.
 * @param {number} teacherId - The teacher's ID to fetch scheduled classes for.
 * @param {function} callback - The callback function to handle the results or error.
 */
function getScheduledClassesByTeacherId(teacherId, callback) {
    const fetchQuery = `
        SELECT 
            sc.scheduled_class_id,
            sc.class_date,
            sc.status,
            c.course_code,
            c.course_title,
            ts.startTime,
            ts.endTime,
            r.Room_no
        FROM 
            ScheduledClass sc
        LEFT JOIN 
            Course c ON sc.course_id = c.course_id
        LEFT JOIN 
            TimeSlot ts ON sc.time_slot_id = ts.time_slot_id
        LEFT JOIN 
            Room r ON sc.room_id = r.room_id
        WHERE 
            sc.teacher_id = ?
        ORDER BY 
            sc.class_date, ts.startTime;
    `;

    db.query(fetchQuery, [teacherId], (error, results) => {
        if (error) {
            console.error('Error fetching scheduled classes:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Updates the status of confirmed classes to 'Conducted' if the current time is greater than the end time.
 * @param {function} callback - The callback function to handle the results or error.
 */
function updateStatusToConducted(callback) {
    const updateQuery = `
        UPDATE ScheduledClass sc
        JOIN TimeSlot ts ON sc.time_slot_id = ts.time_slot_id
        SET sc.status = 'Conducted'
        WHERE sc.status = 'Confirmed'
        AND CONCAT(sc.class_date, ' ', ts.endTime) < NOW();
    `;

    db.query(updateQuery, (error, results) => {
        if (error) {
            console.error('Error updating class status:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Updates the status of a class to 'Confirmed'.
 * @param {number} scheduledClassId - The ID of the scheduled class to update.
 * @param {function} callback - The callback function to handle the results or error.
 */
function confirmClass(scheduledClassId, callback) {
    const updateQuery = `
        UPDATE ScheduledClass
        SET status = 'Confirmed'
        WHERE scheduled_class_id = ? AND status = 'Scheduled';
    `;

    db.query(updateQuery, [scheduledClassId], (error, results) => {
        if (error) {
            console.error('Error confirming class:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Updates the status of a class to 'Cancelled'.
 * @param {number} scheduledClassId - The ID of the scheduled class to cancel.
 * @param {function} callback - The callback function to handle the results or error.
 */
function cancelClass(scheduledClassId, callback) {
    const updateQuery = `
        UPDATE ScheduledClass
        SET status = 'Cancelled'
        WHERE scheduled_class_id = ? AND status = 'Scheduled';
    `;

    db.query(updateQuery, [scheduledClassId], (error, results) => {
        if (error) {
            console.error('Error canceling class:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Updates the status of a class from 'Confirmed' back to 'Scheduled'.
 * @param {number} scheduledClassId - The ID of the scheduled class to update.
 * @param {function} callback - The callback function to handle the results or error.
 */
function setNotConfirmed(scheduledClassId, callback) {
    const updateQuery = `
        UPDATE ScheduledClass
        SET status = 'Scheduled'
        WHERE scheduled_class_id = ? AND status = 'Confirmed';
    `;

    db.query(updateQuery, [scheduledClassId], (error, results) => {
        if (error) {
            console.error('Error setting class to not confirmed:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Fetches all available time slots from the database.
 * @param {function} callback - The callback function to handle the results or error.
 */
function getTimeSlots(callback) {
    const query = 'SELECT * FROM TimeSlot';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching time slots:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

/**
 * Reschedules a class by updating its date and time slot.
 * @param {number} scheduledClassId - The ID of the class to reschedule.
 * @param {string} newDate - The new date for the class (YYYY-MM-DD).
 * @param {number} newTimeSlotId - The ID of the new time slot for the class.
 * @param {function} callback - The callback function to handle the results or error.
 */
function rescheduleClass(scheduledClassId, newDate, newTimeSlotId, callback) {
    const updateQuery = `
        UPDATE ScheduledClass
        SET class_date = ?, time_slot_id = ?
        WHERE scheduled_class_id = ? AND status IN ('Scheduled', 'Confirmed');
    `;
    db.query(updateQuery, [newDate, newTimeSlotId, scheduledClassId], (error, results) => {
        if (error) {
            console.error('Error rescheduling class:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
}

module.exports = {
    createTimeSlotTable,
    createScheduledClassTable,
    getScheduledClassesByTeacherId,
    updateStatusToConducted,
    confirmClass,
    cancelClass,
    setNotConfirmed,
    getTimeSlots,
    rescheduleClass
};
