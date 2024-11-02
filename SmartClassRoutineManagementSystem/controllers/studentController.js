/**
 * @author Jannati Tajrimin Mitu
 * @module studentController
 */
const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');

/**
 * Uploads student data from XML input, clears the existing student table, 
 * and inserts new student records into the database.
 * @async
 * @function uploadStudentAsXML
 * @param {Object} req - The request object containing XML data in `req.body`.
 * @param {Object} res - The response object.
 */
const uploadStudentAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);
    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }
        const rows = result.root.row;
        try {
            await clearTable('Student');
            for (const row of rows) {
                const student_id = row.student_id && row.student_id[0];
                const Name = row.Name && row.Name[0];
                const Gender = row.Gender && row.Gender[0];
                const session_id = row.session_id && row.session_id[0];
                const Class_roll = row.Class_roll && row.Class_roll[0];
                const Exam_roll = row.Exam_roll && row.Exam_roll[0];
                const Registration_no = row.Registration_no && row.Registration_no[0];
                const Email = row.Email && row.Email[0];
                const Password = row.Password && row.Password[0];
                const Phone = row.Phone && row.Phone[0];
                const resetToken = row.resetToken && row.resetToken[0];
                const resetTokenExpires = row.resetTokenExpires && row.resetTokenExpires[0];
                if (Name && Gender && session_id && Class_roll && Exam_roll && Registration_no && Email && Password && Phone) {
                    const hashedPassword = await bcrypt.hash(Password, 10);
                    await insertXmlStudentIntoDatabase({
                        student_id,
                        Name,
                        Gender,
                        session_id,
                        Class_roll,
                        Exam_roll,
                        Registration_no,
                        Email,
                        hashedPassword,
                        Phone,
                        resetToken,
                        resetTokenExpires
                    });
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
 * Inserts a student record into the database.
 * @function insertXmlStudentIntoDatabase
 * @param {Object} data - The student data object.
 * @returns {Promise<Object>} - Resolves with query results or rejects with an error.
 */
const insertXmlStudentIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Student (student_id, Name, Gender, session_id, Class_roll, Exam_roll, Registration_no, Email, Password, Phone, resetToken, resetTokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [data.student_id, data.Name, data.Gender, data.session_id, data.Class_roll, data.Exam_roll, data.Registration_no, data.Email, data.hashedPassword, data.Phone, data.resetToken, data.resetTokenExpires], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
/**
 * Clears all records from the specified table.
 * @function clearTable
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise} - Resolves when the table is cleared or rejects with an error.
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
 * Fetches a student by their email.
 * @function getStudentByEmail
 * @param {string} email - The student's email.
 * @returns {Promise<Object>} - Resolves with the student's data or rejects with an error.
 */
const getStudentByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Student WHERE Email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};
/**
 * Fetches a student by their reset token.
 * @function getStudentByResetToken
 * @param {string} token - The reset token.
 * @returns {Promise<Object>} - Resolves with the student's data or rejects with an error.
 */
const getStudentByResetToken = (token) => {
    
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Student WHERE resetToken = ? AND resetTokenExpires > NOW()";
        db.query(sql, [token], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};
/**
 * Fetches session details by a student's ID.
 * @function getSessionByStudentId
 * @param {string} student_id - The student's ID.
 * @returns {Promise<Object|null>} - Resolves with session details or null if not found.
 */
const getSessionByStudentId = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Session.*
            FROM Student
            INNER JOIN Session ON Student.session_id = Session.session_id
            WHERE Student.student_id = ?;
        `;
        db.query(sql, [student_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0]); // Return the session details
            } else {
                resolve(null); // No session found
            }
        });
    });
};
/**
 * Fetches session details by a student's ID.
 * @function getStudentsBySessionId
 * @param {string} session_id - The session's ID.
 * @returns {Promise<Object|null>} - Resolves with session details or null if not found.
 */
const getStudentsBySessionId = (session_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Student.*
            FROM Student
            WHERE Student.session_id = ?`;
        db.query(sql, [session_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
/**
 * Updates a student's profile.
 * @function updateStudentProfile
 * @param {integer} student_id - The student's ID.
 * @param {Object} updatedData - The updated profile data.
 * @returns {Promise<Object>} - Resolves with the update result or rejects with an error.
 */
const updateStudentProfile = (student_id, updatedData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Student 
            SET Name = ?, Gender = ?, Class_roll = ?, Exam_roll = ?, Registration_no = ?, Email = ?, Phone = ?
            WHERE student_id = ?`;
        
        const { Name, Gender, Class_roll, Exam_roll, Registration_no, Email, Phone } = updatedData;
        db.query(sql, [Name, Gender, Class_roll, Exam_roll, Registration_no, Email, Phone, student_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};
/**
 * Retrieves a student record by ID from the database.
 * @function getStudentById
 * @param {integer} student_id - The student's ID.
 * @returns {Promise<null>} - A promise that resolves with the student object if found
 */
const getStudentById = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Student WHERE student_id = ?';
        db.query(sql, [student_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null); // No student found
            }
        });
    });
};
/**
 * Deletes a student by their ID.
 * @function deleteStudentById
 * @param {integer} student_id - The student's ID.
 * @returns {Promise<Object>} - Resolves with a success message or error if not found.
 */
const deleteStudentById = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Student WHERE student_id = ?';
        
        db.query(sql, [student_id], (err, result) => {
            if (err) {
                return reject(new Error('Failed to delete student'));
            }
            if (result.affectedRows > 0) {
                resolve({ message: 'Student deleted successfully' });
            } else {
                resolve({ error: 'Student not found' });
            }
        });
    });
};
/**
 * Adds a new student to the database.
 *
 * @param {Object} studentData - An object containing the student's information.
 * @param {string} studentData.Name - The name of the student.
 * @param {string} studentData.Gender - The gender of the student.
 * @param {number} studentData.session_id - The session ID of the student.
 * @param {number} studentData.Class_roll - The class roll number of the student.
 * @param {number} studentData.Exam_roll - The exam roll number of the student.
 * @param {number} studentData.Registration_no - The registration number of the student.
 * @param {string} studentData.Email - The email of the student.
 * @param {string} studentData.Password - The plain password of the student (unused in the query).
 * @param {string} studentData.Phone - The phone number of the student.
 * @param {string} hashedPassword - The hashed version of the student's password.
 * @returns {Promise<Object>} A promise that resolves with a success message and the newly added student's ID. It rejects with an error if the operation fails.
 */
const addNewStudent = (studentData, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const { Name, Gender, session_id, Class_roll, Exam_roll, Registration_no, Email, Password, Phone } = studentData;
        const sql = `
            INSERT INTO Student (Name, Gender, session_id, Class_roll, Exam_roll, Registration_no, Email, Password, Phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [Name, Gender, session_id, Class_roll, Exam_roll, Registration_no, Email, hashedPassword, Phone], (err, result) => {
            if (err) {
                return reject(new Error('Failed to add student'));
            }
            resolve({ message: 'Student added successfully', student_id: result.insertId });
        });
    });
};
module.exports = {
    uploadStudentAsXML,
    getStudentByEmail,
    getStudentByResetToken,
    getSessionByStudentId,
    getStudentsBySessionId,
    updateStudentProfile,
    getStudentById,
    deleteStudentById,
    addNewStudent
};