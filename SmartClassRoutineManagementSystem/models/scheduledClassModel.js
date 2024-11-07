const db = require('../config/db')

// Function to create the TimeSlot table
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

// Function to create the ScheduledClass table
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

module.exports = {
    createTimeSlotTable,
    createScheduledClassTable
}
