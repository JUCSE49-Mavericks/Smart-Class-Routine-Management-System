// controllers/teacherController.js

const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');
const { updateProfileImage } = require('../models/teacherModel');
const multer = require('multer');
const path = require('path');

/**
 * Upload teachers from XML data and store them in the database.
 * @param {Object} req - The request object containing XML data.
 * @param {Object} res - The response object to send results.
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
 * Inserts a teacher into the database using data from XML.
 * @param {Object} data - The teacher data to insert.
 * @returns {Promise} - Resolves when the insertion is successful.
 */
const insertXmlTeacherIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO Teacher (teacher_id, Name, Designation, dept_id, Abvr, Email, Password, Phone, resetToken, resetTokenExpires) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
 * Clears all data from the specified table.
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise} - Resolves when the table is cleared.
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
 * Retrieves a teacher by their email.
 * @param {string} email - The email of the teacher.
 * @returns {Promise<Object|null>} - Resolves with the teacher object or null if not found.
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
 * Retrieves a teacher by their reset token.
 * @param {string} token - The reset token.
 * @returns {Promise<Object|null>} - Resolves with the teacher object or null if not found.
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
 * Retrieves all possible designations from the Teacher table.
 * @returns {Promise<string[]>} - Resolves with an array of designations.
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
 * Retrieves teachers by their department ID.
 * @param {string} dept_id - The department ID.
 * @returns {Promise<Object[]>} - Resolves with an array of teachers.
 */
const getTeachersByDeptId = (dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT Teacher.* 
            FROM Teacher 
            WHERE Teacher.dept_id = ?`;
        db.query(sql, [dept_id], (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0 ? result : []);
        });
    });
};

/**
 * Retrieves a teacher by their ID.
 * @param {string} teacher_id - The teacher ID.
 * @returns {Promise<Object|null>} - Resolves with the teacher object or null if not found.
 */
const getTeacherById = (teacher_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Teacher WHERE teacher_id = ?`;
        db.query(sql, [teacher_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.length > 0 ? result[0] : null);
        });
    });
};

/**
 * Updates a teacher's information by their ID.
 * @param {string} teacher_id - The teacher ID.
 * @param {Object} updateData - The data to update.
 * @returns {Promise} - Resolves when the update is successful.
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
 * Retrieves the department associated with a teacher by their ID.
 * @param {string} teacher_id - The teacher ID.
 * @returns {Promise<Object|null>} - Resolves with the department object or null if not found.
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
            resolve(result.length > 0 ? result[0] : null);
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

// Configure Multer with limits and file filters
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('profileImage'); // Ensure 'profileImage' matches the name in the formData

/**
 * Checks the file type for uploads.
 * @param {Object} file - The file to check.
 * @param {Function} cb - Callback function to indicate success or failure.
 */
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

/**
 * Uploads a teacher's profile image.
 * @param {Object} req - The request object containing the uploaded file.
 * @param {Object} res - The response object to send results.
 */
const uploadTeacherImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        } else {
            // Assuming the teacher's ID is passed in the request body
            const teacherId = req.body.teacherId;
            if (!req.file) {
                return res.status(400).json({ message: 'No file selected!' });
            }
            const profileImagePath = `uploads/${req.file.filename}`;
            updateProfileImage(teacherId, profileImagePath)
                .then(() => {
                    res.status(200).json({ message: 'Image uploaded successfully!', profileImage: profileImagePath });
                })
                .catch((error) => {
                    res.status(500).json({ message: 'Error updating profile image', error });
                });
        }
    });
};

module.exports = {
    uploadTeacherAsXML,
    getTeacherByEmail,
    getTeacherByResetToken,
    getTeacherDesignations,
    getTeachersByDeptId,
    getTeacherById,
    updateTeacherById,
    getDepartmentByTeacherId,
    uploadTeacherImage,
};
