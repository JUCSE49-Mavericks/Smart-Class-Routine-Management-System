/**
 * @module CourseDataFetcher
 * @description A class to fetch course data from the database.
 */

const pool = require('../config/db');

class CourseDataFetcher {

    /**
     * @constructor
     * @param {Object} pool - Database connection.
     */
    constructor(pool) {
        this.pool = pool;
    }

     /**
     * Fetches course data based on department, session, exam year and course name.
     * @param {string} departmentName - The name of the department.
     * @param {string} sessionName - The name of the session.
     * @param {string} examYear - The examination year.
     * @param {string} courseName - The name of the course.
     * @param {function} callback - A callback function to handle the fetched course data or error.
     */
    fetchCourseData(departmentName, sessionName, examYear, courseName, callback) {
        this.getDepartmentId(departmentName)
            .then(deptId => this.getSessionId(deptId, sessionName))
            .then(sessionId => this.getExamYearId(sessionId, examYear))
            .then(examYearId => this.getCourseData(examYearId, courseName))
            .then(courseData => this.fetchAdditionalData(courseData))
            .then(courseData => callback(null, courseData))
            .catch(err => callback(err, null));
    }

    /**
     * Retrieves department ID based on department name.
     * @param {string} departmentName - The name of the department.
     * @returns {Promise<number>} - Resolves with department ID or rejects with an error.
     */
    getDepartmentId(departmentName) {
        const query = 'SELECT dept_id FROM department WHERE Dept_Name = ?;';
        return new Promise((resolve, reject) => {
            this.pool.query(query, [departmentName], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error('Department not found'));
                resolve(results[0].dept_id);
            });
        });
    }

    /**
     * Retrieves session ID based on department ID and session name.
     * @param {number} deptId - Department ID.
     * @param {string} sessionName - The name of the session.
     * @returns {Promise<number>} - Resolves with session ID or rejects with an error.
     */    
    getSessionId(deptId, sessionName) {
        const query = 'SELECT session_id FROM session WHERE dept_id = ? AND Session_name = ?;';
        return new Promise((resolve, reject) => {
            this.pool.query(query, [deptId, sessionName], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error('Session not found'));
                resolve(results[0].session_id);
            });
        });
    }

    /**
     * Retrieves exam year ID based on session ID and exam year.
     * @param {number} sessionId - Session ID.
     * @param {string} examYear - The examination year.
     * @returns {Promise<number>} - Resolves with exam year ID or rejects with an error.
     */    
    getExamYearId(sessionId, examYear) {
        const query = 'SELECT exam_year_id FROM examyear WHERE session_id = ? AND Exam_year = ?;';
        return new Promise((resolve, reject) => {
            this.pool.query(query, [sessionId, examYear], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error('Exam year not found'));
                resolve(results[0].exam_year_id);
            });
        });
    }

    /**
     * Retrieves core course data for a given exam year ID and course name.
     * @param {number} examYearId - Exam year ID.
     * @param {string} courseName - The name of the course.
     * @returns {Promise<Object>} - Resolves with course data or an empty object.
     */    
    getCourseData(examYearId, courseName) {
        const query = `
            SELECT 
                c.course_id, 
                c.Course_code,
                c.Couorse_credit, 
                c.course_title, 
                c.course_type, 
                c.contact_hour, 
                c.rationale
            FROM course c
            WHERE c.exam_year_id = ? AND c.course_title = ?;
        `;
        return new Promise((resolve, reject) => {
            this.pool.query(query, [examYearId, courseName], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve({});
                const courseData = results[0];
                courseData.chapters = [];
                courseData.objectives = [];
                courseData.prerequisites = [];
                courseData.recommended_books = [];
                courseData.student_learning_outcomes = [];
                resolve(courseData);
            });
        });
    }

    /**
     * Fetches additional course-related data like chapters, objectives, prerequisites, recommended books, and learning outcomes.
     * @param {Object} courseData - The core course data.
     * @returns {Promise<Object>} - Resolves with enriched course data.
     */    
    fetchAdditionalData(courseData) {
        const courseId = courseData.course_id;
        const promises = [
            this.fetchChapters(courseId, courseData),
            this.fetchObjectives(courseId, courseData),
            this.fetchPrerequisites(courseId, courseData),
            this.fetchRecommendedBooks(courseId, courseData),
            this.fetchLearningOutcomes(courseId, courseData)
        ];
        return Promise.all(promises).then(() => courseData);
    }

    /**
     * Fetches course chapters.
     * @param {number} courseId - Course ID.
     * @param {Object} courseData - The course data object to populate.
     * @returns {Promise<void>}
     */    
    fetchChapters(courseId, courseData) {
        const query = 'SELECT Chapter FROM coursechapter WHERE course_id = ?;';
        return this.executeArrayQuery(query, courseId, 'Chapter', courseData.chapters);
    }

    /**
     * Fetches course objectives.
     * @param {number} courseId - Course ID.
     * @param {Object} courseData - The course data object to populate.
     * @returns {Promise<void>}
     */    
    fetchObjectives(courseId, courseData) {
        const query = 'SELECT Objective FROM courseobjective WHERE course_id = ?;';
        return this.executeArrayQuery(query, courseId, 'Objective', courseData.objectives);
    }

    /**
     * Fetches recommended books for the course.
     * @param {number} courseId - Course ID.
     * @param {Object} courseData - The course data object to populate.
     * @returns {Promise<void>}
     */    
    fetchPrerequisites(courseId, courseData) {
        const query = 'SELECT Prerequisite FROM prerequisitecourse WHERE course_id = ?;';
        return this.executeArrayQuery(query, courseId, 'Prerequisite', courseData.prerequisites);
    }

    /**
     * Fetches student learning outcomes for the course.
     * @param {number} courseId - Course ID.
     * @param {Object} courseData - The course data object to populate.
     * @returns {Promise<void>}
     */    
    fetchRecommendedBooks(courseId, courseData) {
        const query = `
            SELECT Book_title, Writer, Edition, Publisher, Publish_year 
            FROM recommendedbook WHERE course_id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.pool.query(query, [courseId], (err, results) => {
                if (err) return reject(err);
                courseData.recommended_books = results;
                resolve();
            });
        });
    }

    /**
     * Executes a query that returns an array of values, populating a specific property in courseData.
     * @param {string} query - SQL query string.
     * @param {number} courseId - Course ID for the query parameter.
     * @param {string} column - Column name in the result to extract data from.
     * @param {Array} array - Array in courseData to populate.
     * @returns {Promise<void>}
     */    
    fetchLearningOutcomes(courseId, courseData) {
        const query = 'SELECT Outcome FROM studentlearningoutcome WHERE course_id = ?;';
        return this.executeArrayQuery(query, courseId, 'Outcome', courseData.student_learning_outcomes);
    }

    executeArrayQuery(query, courseId, column, array) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, [courseId], (err, results) => {
                if (err) return reject(err);
                array.push(...results.map(row => row[column]));
                resolve();
            });
        });
    }
}

module.exports = CourseDataFetcher;
