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

    /**
     * Retrieves the number of classes needed for a course.
     * @param {string} courseName - The name of the course.
     * @returns {number} The number of classes needed.
     */
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
            return Math.max(threshold_classes - classes_performed, 0);
        } catch (error) {
            console.error('Error fetching class counts:', error);
            throw error;
        }
    }

    /**
     * Retrieves the course type for a specific course name.
     * @param {string} courseName - The name of the course to get the type for.
     * @returns {string} The course type, either 'Lab' or 'Theory'.
     */
    static async getCourseTypeByCourseName(courseName) {
        const query = `
            SELECT course_type
            FROM makeupschedule
            WHERE course_name = ?
            LIMIT 1
        `;
        try {
            const [rows] = await db.query(query, [courseName]);
            if (rows.length === 0) {
                throw new Error('Course not found');
            }
            return rows[0].course_type;
        } catch (error) {
            console.error('Error fetching course type by course name:', error);
            throw error;
        }
    }
}

module.exports = MakeupScheduleModel;