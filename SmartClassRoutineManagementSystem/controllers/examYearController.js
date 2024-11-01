const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/**
 * Handles the uploading of exam year data in XML format.
 * @param {Object} req - The request object containing XML data in the body.
 * @param {Object} res - The response object used to send responses to the client.
 */
const uploadExamYearAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData); // Log incoming data for debugging

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }

        const rows = result.root.row; // Extract rows from the parsed XML
        try {
            await clearTable('ExamYear'); // Clear the table before inserting new data

            for (const row of rows) {
                const exam_year_id = row.exam_year_id && row.exam_year_id[0];
                const session_id = row.session_id && row.session_id[0];
                const Education_level = row.Education_level && row.Education_level[0];
                const Exam_year = row.Exam_year && row.Exam_year[0];
                const Year = row.Year && row.Year[0];
                const Semester = row.Semester && row.Semester[0];
                const Start_date = row.Start_date && row.Start_date[0];
                const End_date = row.End_date && row.End_date[0];

                // Check if all required fields are present
                if (session_id && Education_level && Exam_year && Year && Semester && Start_date && End_date) {
                    await insertXmlExamYearIntoDatabase({ exam_year_id, session_id, Education_level, Exam_year, Year, Semester, Start_date, End_date });
                } else {
                    console.warn('Skipping incomplete row:', row);
                }
            }
            res.status(200).send('XML data imported successfully.');
        } catch (error) {
            console.error('Error importing XML data:', error);
            res.status(500).send('Error importing XML data.');
        }
    });
};

/**
 * Inserts a single exam year record into the database.
 * @param {Object} row - An object containing the exam year data to be inserted.
 * @returns {Promise} A promise that resolves when the insertion is complete.
 */
const insertXmlExamYearIntoDatabase = (row) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO ExamYear(exam_year_id, session_id, Education_level, Exam_year, Year, Semester, Start_date, End_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [row.exam_year_id, row.session_id, row.Education_level, row.Exam_year, row.Year, row.Semester, row.Start_date, row.End_date], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * Retrieves all exam years associated with a specific department ID.
 * @param {number} dept_id - The ID of the department for which to fetch exam years.
 * @returns {Promise} A promise that resolves to an array of exam years.
 */
const getExamYearsByDepartmentId = (dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT ExamYear.* 
            FROM ExamYear 
            INNER JOIN Session ON ExamYear.session_id = Session.session_id 
            WHERE Session.dept_id = ?`;

        db.query(sql, [dept_id], (err, result) => {
            if (err) {
                console.error('Error fetching exam years:', err);
                return reject(err);
            }
            resolve(result.length > 0 ? result : []); // Return an empty array if no exam years found
        });
    });
};

/**
 * Clears all records from the specified table.
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise} A promise that resolves when the table is cleared.
 */
const clearTable = (tableName) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${tableName}`;
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * Retrieves all exam years associated with a specific session ID.
 * @param {number} session_id - The session ID for which to fetch exam years.
 * @returns {Promise} A promise that resolves to an array of exam years.
 */
const getExamYearsBySessionId = (session_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT ExamYear.*
            FROM ExamYear
            WHERE ExamYear.session_id = ?`;
        db.query(sql, [session_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Adds a new exam year record to the database.
 * @param {Object} req - The request object containing the exam year data in the body.
 * @param {Object} res - The response object used to send responses to the client.
 */
const addNewExamYear = (req, res) => {
    const { Year, Semester, Exam_year, Education_level, Start_date, End_date, session_id } = req.body;
    const sql = `
        INSERT INTO ExamYear (Year, Semester, Exam_year, Education_level, Start_date, End_date, session_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [Year, Semester, Exam_year, Education_level, Start_date, End_date, session_id], (err, result) => {
        if (err) {
            console.error('Error adding exam year:', err);
            return res.status(500).json({ message: 'Failed to add exam year.' });
        }
        res.status(201).json({ message: 'Exam year added successfully.' });
    });
};

/**
 * Deletes an exam year record by its ID.
 * @param {Object} req - The request object containing the exam year ID in the params.
 * @param {Object} res - The response object used to send responses to the client.
 */
const deleteExamYear = (req, res) => {
    const { exam_year_id } = req.params;
    const sql = `DELETE FROM ExamYear WHERE exam_year_id = ?`;

    db.query(sql, [exam_year_id], (err, result) => {
        if (err) {
            console.error('Error deleting exam year:', err);
            return res.status(500).json({ message: 'Failed to delete exam year.' });
        }
        res.status(200).json({ message: 'Exam year deleted successfully.' });
    });
};

module.exports = {
    uploadExamYearAsXML,
    getExamYearsByDepartmentId,
    getExamYearsBySessionId,
    addNewExamYear,
    deleteExamYear
};
