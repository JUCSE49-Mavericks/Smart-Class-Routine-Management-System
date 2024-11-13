/**
 * @module teacherController
 * @description Controller for managing teacher-related operations, including
 * uploading teacher data from XML, handling image uploads, and managing teacher
 * information in the database.
 */

const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');
const { updateProfileImage, getAllTeachers } = require('../models/teacherModel')
const multer = require('multer');
const path = require('path');



/**
 * Upload teachers data from an XML file and insert it into the database.
 * @function uploadTeacherAsXML
 * @param {Object} req - The request object containing XML data in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {Promise<void>} - A promise that resolves when the import is complete.
 */
const uploadTeacherAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }

        const rows = result.root.row;
        try {
            await clearTable('Teacher');
            for (const row of rows) {
                const teacher_id = row.teacher_id && row.teacher_id[0];
                const Name = row.Name && row.Name[0];
                const Designation = row.Designation && row.Designation[0];
                const dept_id = row.dept_id && row.dept_id[0];
                const Abvr = row.Abvr && row.Abvr[0];
                const Email = row.Email && row.Email[0];
                const Password = row.Password && row.Password[0];
                const Phone = row.Phone && row.Phone[0];
                const resetToken = row.resetToken && row.resetToken[0];
                const resetTokenExpires = row.resetTokenExpires && row.resetTokenExpires[0];


                if (Name && Designation && dept_id && Abvr && Email && Password && Phone) {
                    const hashedPassword = await bcrypt.hash(Password, 10);
                    await insertXmlTeacherIntoDatabase({
                        teacher_id,
                        Name,
                        Designation,
                        dept_id,
                        Abvr,
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
 * Insert a teacher's data into the database.
 * @function insertXmlTeacherIntoDatabase
 * @param {Object} data - The teacher's data to be inserted.
 * @param {string} data.teacher_id - The unique ID of the teacher.
 * @param {string} data.Name - The name of the teacher.
 * @param {string} data.Designation - The designation of the teacher.
 * @param {string} data.dept_id - The department ID of the teacher.
 * @param {string} data.Abvr - The abbreviation for the teacher's designation.
 * @param {string} data.Email - The email address of the teacher.
 * @param {string} data.hashedPassword - The hashed password for the teacher.
 * @param {string} data.Phone - The phone number of the teacher.
 * @param {string} data.resetToken - The reset token for password recovery.
 * @param {Date} data.resetTokenExpires - The expiration date for the reset token.
 * @returns {Promise<void>} - A promise that resolves when the insertion is complete.
 */
const insertXmlTeacherIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Teacher (teacher_id, Name, Designation, dept_id, Abvr, Email, Password, Phone, resetToken, resetTokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [data.teacher_id, data.Name, data.Designation, data.dept_id, data.Abvr, data.Email, data.hashedPassword, data.Phone, data.resetToken, data.resetTokenExpires], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


/**
 * Clear all records from a specified database table.
 * @function clearTable
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise<void>} - A promise that resolves when the table is cleared.
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
 * Get a teacher by their email address.
 * @function getTeacherByEmail
 * @param {string} email - The email address of the teacher.
 * @returns {Promise<Object|null>} - A promise that resolves to the teacher object or null if not found.
 */
const getTeacherByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teacher WHERE email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};


/**
 * Get a teacher by their reset token.
 * @function getTeacherByResetToken
 * @param {string} token - The reset token of the teacher.
 * @returns {Promise<Object|null>} - A promise that resolves to the teacher object or null if not found.
 */
const getTeacherByResetToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teacher WHERE resetToken = ? AND resetTokenExpires > NOW()";
        db.query(sql, [token], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};


/**
 * Get the designations available for teachers from the database.
 * @function getTeacherDesignations
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of designations.
 */
const getTeacherDesignations = () => {
    return new Promise((resolve, reject) => {
        const sql = "SHOW COLUMNS FROM Teacher LIKE 'Designation'";
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            const type = result[0].Type;
            const values = type.substring(5, type.length - 1).split(',');
            const designations = values.map(value => value.replace(/'/g, ""));
            resolve(designations);
        });
    });
};


/**
 * Get all teachers by their department ID.
 * @function getTeachersByDeptId
 * @param {number} dept_id - The ID of the department.
 * @returns {Promise<Array>} - A promise that resolves to an array of teachers.
 */
const getTeachersByDeptId = (dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Teacher.* 
            FROM Teacher 
            WHERE Teacher.dept_id = ?`;
        db.query(sql, [dept_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result); // Return the list of teachers
            } else {
                resolve([]); // Return an empty array if no teachers are found
            }
        });
    });
};


/**
 * Get a teacher by their ID.
 * @function getTeacherById
 * @param {number} teacher_id - The ID of the teacher.
 * @returns {Promise<Object|null>} - A promise that resolves to the teacher object or null if not found.
 */
const getTeacherById = (teacher_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Teacher WHERE teacher_id = ?`;

        db.query(sql, [teacher_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null); // No teacher found
            }
        });
    });
};

/**
 * Update a teacher's details by their ID.
 * @function updateTeacherById
 * @param {number} teacher_id - The ID of the teacher.
 * @param {Object} updateData - The data to update.
 * @param {string} updateData.Name - The new name of the teacher.
 * @param {string} updateData.Designation - The new designation of the teacher.
 * @param {string} updateData.dept_id - The new department ID of the teacher.
 * @param {string} updateData.Abvr - The new abbreviation for the teacher's designation.
 * @param {string} updateData.Email - The new email address of the teacher.
 * @param {string} updateData.Phone - The new phone number of the teacher.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
const updateTeacherById = (teacher_id, updateData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Teacher 
            SET Name = ?, Designation = ?, dept_id = ?, Abvr = ?, Email = ?, Phone = ? 
            WHERE teacher_id = ?`;

        const { Name, Designation, dept_id, Abvr, Email, Phone } = updateData;

        db.query(sql, [Name, Designation, dept_id, Abvr, Email, Phone, teacher_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};



/**
 * Get the department associated with a specific teacher.
 * @function getDepartmentByTeacherId
 * @param {number} teacher_id - The ID of the teacher.
 * @returns {Promise<Object|null>} - A promise that resolves to the department object or null if not found.
 */
const getDepartmentByTeacherId = (teacher_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Department.* 
            FROM Teacher 
            INNER JOIN Department ON Teacher.dept_id = Department.dept_id 
            WHERE Teacher.teacher_id = ?`;
        db.query(sql, [teacher_id], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null); // No department found
            }
        });
    });
};



// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('profileImage'); // Ensure 'profileImage' matches the name in the formData


function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


/**
 * Handle image upload for a teacher.
 * @function uploadImage
 * @param {Object} req - The request object containing the image file.
 * @param {Object} res - The response object to send the result.
 * @returns {Promise<void>} - A promise that resolves when the image upload is complete.
 */
const uploadTeacherImage = (req, res) => {
    const teacher_id = req.params.id;
    console.log(teacher_id)
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file);

    const profileImage = req.file.filename;

    updateProfileImage(teacher_id, profileImage, (err, result) => {
        if (err) {
            console.error('Error updating profile image in DB:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        res.status(200).json({ message: 'Profile image uploaded successfully', profileImage });
    });
};

/**
 * Updates the profile of a teacher in the database.
 * @param {number} teacher_id - The ID of the teacher to update.
 * @param {Object} data - The data to update the teacher profile with.
 * @param {string} data.Name - The name of the teacher.
 * @param {string} data.Designation - The designation of the teacher.
 * @param {number} data.dept_id - The department ID of the teacher.
 * @param {string} data.Abvr - The abbreviation for the teacher.
 * @param {string} data.Email - The email address of the teacher.
 * @param {string} data.Phone - The phone number of the teacher.
 * @returns {Promise<Object>} - A promise that resolves to the result of the database operation.
 */
const updateTeacherProfile = (teacher_id, data) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Teacher 
            SET Name = ?, Designation = ?, dept_id = ?, Abvr = ?, Email = ?, Phone = ?
            WHERE teacher_id = ?`;
        db.query(sql, [data.Name, data.Designation, data.dept_id, data.Abvr, data.Email, data.Phone, teacher_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


/**
 * Adds a new teacher to the database.
 * @param {Object} teacher - The teacher data to insert.
 * @param {string} teacher.Name - The name of the teacher.
 * @param {string} teacher.Designation - The designation of the teacher.
 * @param {number} teacher.dept_id - The department ID of the teacher.
 * @param {string} teacher.Abvr - The abbreviation for the teacher.
 * @param {string} teacher.Email - The email address of the teacher.
 * @param {string} teacher.Phone - The phone number of the teacher.
 * @param {string} teacher.hashedPassword - The hashed password of the teacher.
 * @returns {Promise<Object>} - A promise that resolves to the result of the database operation.
 */
const addNewTeacher = ({ Name, Designation, dept_id, Abvr, Email, Phone, hashedPassword }) => {
    
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO Teacher (Name, Designation, dept_id, Abvr, Email, Phone, Password) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [Name, Designation, dept_id, Abvr, Email, Phone, hashedPassword], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Deletes a teacher from the database by their ID.
 * @param {number} teacher_id - The ID of the teacher to delete.
 * @returns {Promise<Object>} - A promise that resolves to the result of the database operation.
 */
const deleteTeacherById = (teacher_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM Teacher WHERE teacher_id = ?
        `;
        db.query(sql, [teacher_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


/**
 * Controller to handle fetching all teachers from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
const fetchAllTeachers = async (req, res) => {
    try {
        const results = await getAllTeachers();

        if (results.length === 0) {
            return res.status(404).json({ message: 'No teachers found' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        res.status(500).json({ error: 'Database error' });
    }
};



module.exports = {
    uploadTeacherAsXML,
    getTeacherByEmail,
    getTeacherByResetToken,
    uploadTeacherImage,
    getDepartmentByTeacherId,
    getTeachersByDeptId,
    getTeacherById,
    updateTeacherById,
    getTeacherDesignations,
    updateTeacherProfile,
    addNewTeacher,
    deleteTeacherById,
    fetchAllTeachers
};
