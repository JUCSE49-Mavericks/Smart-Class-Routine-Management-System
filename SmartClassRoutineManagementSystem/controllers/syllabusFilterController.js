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

    
}

module.exports = CourseDataFetcher;
