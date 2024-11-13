//controllers/examYearController.js

/**
 * @module controllers/examYearController
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const ExamYearModel = require('../models/examYearModel');
const {
    getExamYearById,
    getExamCommitteeByExamYearId
} = require('../models/examYearModel')



/**
 * Uploads exam year data in XML format and imports it into the database.
 * 
 * @function uploadExamYearAsXML
 * @async
 * @param {Object} req - The request object containing XML data in the body.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves when the XML data is imported successfully.
 */
const uploadExamYearAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData); // Log incoming data for debugging

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }
        const rows = result.root.row;
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
                    // const hashedPassword = await bcrypt.hash(Password, 10);
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
 * Inserts exam year data into the database.
 * 
 * @function insertXmlExamYearIntoDatabase
 * @param {Object} row - The exam year data to insert.
 * @returns {Promise<void>} Resolves when the data is inserted successfully.
 */
const insertXmlExamYearIntoDatabase = (row) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO ExamYear(exam_year_id,session_id,Education_level,Exam_year,Year,Semester,Start_date,End_date) VALUES (?, ?, ?, ?, ?,?,?,?)';
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
 * Retrieves exam years associated with a specific department.
 * 
 * @function getExamYearsByDepartmentId
 * @param {number} dept_id - The department ID.
 * @returns {Promise<Array>} Resolves with an array of exam years.
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

            if (result.length > 0) {
                resolve(result);
            } else {
                resolve([]); // No exam years found
            }
        });
    });
};


/**
 * Clears all data from a specified table.
 * 
 * @function clearTable
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise<void>} Resolves when the table is cleared.
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
 * Retrieves exam years by session ID.
 * 
 * @function getExamYearsBySessionId
 * @param {number} session_id - The session ID.
 * @returns {Promise<Array>} Resolves with an array of exam years.
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
 * Adds a new exam year to the database.
 * 
 * @function addNewExamYear
 * @param {Object} req - The request object containing exam year data in the body.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves when the exam year is added successfully.
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
 * Deletes an exam year from the database.
 * 
 * @function deleteExamYear
 * @param {Object} req - The request object containing the exam year ID in the parameters.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves when the exam year is deleted successfully.
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



/**
 * Fetches exam year details by ID.
 * 
 * @function fetchExamYearById
 * @async
 * @param {Object} req - The request object containing the exam year ID in the parameters.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves with the exam year details.
 */
const fetchExamYearById = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getExamYearById(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Exam year not found' });
        }

        // console.log(results);

        res.json(results[0]); // Return the first matching record
    } catch (error) {
        console.error('Error fetching exam year data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};


/**
 * Fetches the exam committee associated with a specific exam year ID.
 * 
 * @function fetchExamCommitteeByExamYearId
 * @async
 * @param {Object} req - The request object containing the exam year ID in the parameters.
 * @param {Object} res - The response object used to send a response.
 * @returns {Promise<void>} Resolves with the exam committee details.
 */
const fetchExamCommitteeByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;
    // console.log('hola hola')
    try {
        const results = await getExamCommitteeByExamYearId(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Exam year not found' });
        }

        // Combining the exam year details with the exam committee details
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching exam year data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};



module.exports = {
    uploadExamYearAsXML,
    getExamYearsByDepartmentId,
    getExamYearsBySessionId,
    addNewExamYear,
    deleteExamYear,
    fetchExamYearById,
    fetchExamCommitteeByExamYearId
};
