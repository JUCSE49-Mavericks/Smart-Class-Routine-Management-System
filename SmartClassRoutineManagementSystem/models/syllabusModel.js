
/**
 * @module CourseTableCreator
 * @description A module to create necessary tables for managing course data, prerequisites, chapters, objectives, learning outcomes, and recommended books in a database.
 */
const db = require('../config/db');

/**
 * Creates the `Course` table to store information about courses.
 * Fields include course ID, exam year ID, course code, credit, title, type, contact hour, and rationale.
 */
const createCourseTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Course (
            course_id INT AUTO_INCREMENT PRIMARY KEY,
            exam_year_id INT NOT NULL,
            Course_code VARCHAR(10) NOT NULL,
            Couorse_credit INT NOT NULL,
            Course_title VARCHAR(255) NOT NULL,
            Course_type ENUM('Theory', 'Lab') NOT NULL,
            Contact_hour INT NOT NULL,
            Rationale TEXT NOT NULL,
            FOREIGN KEY (exam_year_id) REFERENCES ExamYear(exam_year_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating course table:', err);
            throw err;
        }
        console.log('Course table created or already exists');
    });
};

/**
 * Creates the `PrerequisiteCourse` table to store information about prerequisites for each course.
 * Fields include prerequisite ID, course ID, and prerequisite description.
 */
const createPrerequisiteCourseTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS PrerequisiteCourse (
            prc_id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT,
            Prerequisite VARCHAR(255) NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating PrerequisiteCourse table:', err);
            throw err;
        }
        console.log('Prerequisite table created or already exists');
    });
};

/**
 * Creates the `CourseChapter` table to store chapter information for each course.
 * Fields include chapter ID, course ID, and chapter title or description.
 */
const createCourseChapterTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS CourseChapter (
            chapter_id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT,
            Chapter VARCHAR(255) NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating CourseChapter table:', err);
            throw err;
        }
        console.log('CourseChapter table created or already exists');
    });
};

/**
 * Creates the `CourseObjective` table to store learning objectives for each course.
 * Fields include objective ID, course ID, and objective description.
 */
const createCourseObjectiveTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS CourseObjective (
            co_id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT,
            Objective TEXT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating CourseObjective:', err);
            throw err;
        }
        console.log('CourseObjective table created or already exists');
    });
};

/**
 * Creates the `StudentLearningOutcome` table to store learning outcomes for each course.
 * Fields include outcome ID, course ID, and outcome description.
 */
const createStudentLearningOutcomesTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS StudentLearningOutcome (
            slo_id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT,
            Outcome TEXT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating StudentLearningOutcome table:', err);
            throw err;
        }
        console.log('StudentLearningOutcome table created or already exists');
    });
};

/**
 * Creates the `RecommendedBook` table to store recommended books for each course.
 * Fields include book ID, course ID, book title, writer, edition, publisher, and publish year.
 */
const createRecommendedBookTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS RecommendedBook (
            book_id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT,
            Book_title VARCHAR(255) NOT NULL,
            Writer VARCHAR(255) NOT NULL,
            Edition INT NOT NULL,
            Publisher VARCHAR(255) NOT NULL,
            Publish_year VARCHAR(255) NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Course(course_id)
        );
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating RecommendedBook table:', err);
            throw err;
        }
        console.log('RecommendedBook table created or already exists');
    });
};



module.exports = {
    createCourseTable,
    createPrerequisiteCourseTable,
    createCourseChapterTable,
    createCourseObjectiveTable,
    createStudentLearningOutcomesTable,
    createRecommendedBookTable
};