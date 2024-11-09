const db = require('../config/db');

class MakeupScheduleModel {
    /**
     * Creates the Makeup_Schedule table if it does not exist.
     */
    static async createmakeupscheduleTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS makeupschedule (
                id SERIAL PRIMARY KEY,
                course_name VARCHAR(255) NOT NULL,
                course_type ENUM('Lab', 'Theory') NOT NULL,
                teacher_name VARCHAR(255) NOT NULL,
                year INT NOT NULL,
                classes_performed INT DEFAULT 0,
                threshold_classes INT NOT NULL
            );
        `;
        try {
            await db.query(query);
            console.log('makeupschedule table created or already exists');
        } catch (error) {
            console.error('Error creating makeupschedule table:', error);
            throw error;
        }
    }

    /**
     * Inserts a new schedule entry into the makeupschedule table.
     * @param {Object} entry - The schedule entry to insert.
     */
    static async insertEntry(entry) {
        const query = `
            INSERT INTO makeupschedule (
                course_name, course_type, teacher_name, year, classes_performed, threshold_classes
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            entry.course_name, entry.course_type, entry.teacher_name,
            entry.year, entry.classes_performed || 0, entry.threshold_classes
        ];
        try {
            const [result] = await db.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error inserting entry:', error);
            throw error;
        }
    }
    static async getClassesNeeded(courseName) {
        const query = `
            SELECT threshold_classes, classes_performed
            FROM makeupschedule
            WHERE course_name = ?
        `;
        try {
            const [rows] = await db.query(query, [courseName]);
            if (rows.length === 0) {
                throw new Error('Course not found');
            }

            const { threshold_classes, classes_performed } = rows[0];
            const classesNeeded = threshold_classes - classes_performed;

            return classesNeeded > 0 ? classesNeeded : 0; // Ensure non-negative result
        } catch (error) {
            console.error('Error fetching class counts:', error);
            throw error;
        }
    }

    // Additional methods for updating, deleting, and retrieving entries can be added here.
}

module.exports = MakeupScheduleModel;
