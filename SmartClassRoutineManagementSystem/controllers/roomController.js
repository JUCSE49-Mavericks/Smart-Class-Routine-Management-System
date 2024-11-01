const bcrypt = require('bcryptjs');
const xml2js = require('xml2js');
const db = require('../config/db');

/**
 * @function uploadRoomAsXML
 * @description Handles the uploading of room data from XML format.
 * It parses the XML, clears the Room table, and inserts new room data.
 * @param {Object} req - The request object containing XML data.
 * @param {Object} res - The response object to send back to the client.
 */
const uploadRoomAsXML = async (req, res) => {
    const xmlData = req.body;
    console.log('Received XML Data:', xmlData);

    xml2js.parseString(xmlData, async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML data');
        }

        const rows = result.root.row; // Access rows in XML
        try {
            await clearTable('Room'); // Clear existing room data
            for (const row of rows) {
                const room_id = row.room_id && row.room_id[0];
                const Room_no = row.Room_no && row.Room_no[0];
                const Room_type = row.Room_type && row.Room_type[0];
                const Capacity = row.Capacity && row.Capacity[0];
                const dept_id = row.dept_id && row.dept_id[0];

                // Check for completeness of each row before insertion
                if (room_id && Room_no && Room_type && Capacity && dept_id) {
                    await insertXmlRoomIntoDatabase({
                        room_id,
                        Room_no,
                        Room_type,
                        Capacity,
                        dept_id
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
 * @function insertXmlRoomIntoDatabase
 * @description Inserts a room record into the database.
 * @param {Object} data - An object containing room details.
 * @returns {Promise} - A promise that resolves when the insertion is complete.
 */
const insertXmlRoomIntoDatabase = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Room (room_id, Room_no, Room_type, Capacity, dept_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [data.room_id, data.Room_no, data.Room_type, data.Capacity, data.dept_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * @function getRoomsByDepartmentId
 * @description Fetches all rooms associated with a given department ID.
 * @param {number} dept_id - The ID of the department.
 * @returns {Promise<Array>} - A promise that resolves to an array of room objects.
 */
const getRoomsByDepartmentId = (dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Room WHERE dept_id = ?';
        db.query(sql, [dept_id], (err, result) => {
            if (err) {
                console.error('Error fetching rooms:', err);
                return reject(err);
            }
            resolve(result.length > 0 ? result : []); // Return found rooms or empty array
        });
    });
};

/**
 * @function clearTable
 * @description Clears all records from a specified database table.
 * @param {string} tableName - The name of the table to clear.
 * @returns {Promise} - A promise that resolves when the table is cleared.
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
 * @function getRoomById
 * @description Retrieves a room by its ID.
 * @param {number} room_id - The ID of the room to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the room object.
 */
const getRoomById = (room_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Room WHERE room_id = ?';
        db.query(sql, [room_id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

/**
 * @function getRoomTypes
 * @description Retrieves the possible types of rooms from the database.
 * @returns {Promise<Array>} - A promise that resolves to an array of room types.
 */
const getRoomTypes = () => {
    return new Promise((resolve, reject) => {
        const sql = "SHOW COLUMNS FROM Room LIKE 'Room_type'";
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                const enumValues = result[0].Type.replace(/^enum\('|'|\)$/g, '').split(',');
                resolve(enumValues.map(value => value.replace(/'/g, '')));
            } else {
                resolve([]);
            }
        });
    });
};

/**
 * @function updateRoom
 * @description Updates the details of a room in the database.
 * @param {number} room_id - The ID of the room to update.
 * @param {Object} updatedData - An object containing the updated room details.
 * @returns {Promise} - A promise that resolves when the update is complete.
 */
const updateRoom = (room_id, updatedData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Room
            SET Room_no = ?, Room_type = ?, Capacity = ?
            WHERE room_id = ?`;
        db.query(sql, [updatedData.Room_no, updatedData.Room_type, updatedData.Capacity, room_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * @function deleteRoom
 * @description Deletes a room from the database by its ID.
 * @param {Object} req - The request object containing room_id in parameters.
 * @param {Object} res - The response object to send back to the client.
 */
const deleteRoom = (req, res) => {
    const { room_id } = req.params;
    const sql = 'DELETE FROM Room WHERE room_id = ?';
    db.query(sql, [room_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows > 0) {
            res.json({ message: 'Room deleted successfully' });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    });
};

/**
 * @function addNewRoom
 * @description Adds a new room to the database.
 * @param {string} Room_no - The number of the room.
 * @param {string} Room_type - The type of the room.
 * @param {number} Capacity - The capacity of the room.
 * @param {number} dept_id - The ID of the department to which the room belongs.
 * @returns {Promise} - A promise that resolves when the room is added.
 */
const addNewRoom = (Room_no, Room_type, Capacity, dept_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO Room (Room_no, Room_type, Capacity, dept_id)
            VALUES (?, ?, ?, ?)`;
        db.query(sql, [Room_no, Room_type, Capacity, dept_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    uploadRoomAsXML,
    getRoomsByDepartmentId,
    getRoomById,
    getRoomTypes,
    updateRoom,
    deleteRoom,
    addNewRoom
};
