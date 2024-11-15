//models/RescheduleModel.js
/**
 * @module RescheduleModel
 */

/**
 * Creates the reschedule_requests table if it does not exist.
 * @function
 * @throws {Error} If there is an error executing the table creation query.
 */

const db = require('../config/db')
const createRescheduleRequestTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS reschedule_requests (
            reschedule_request_id INT AUTO_INCREMENT PRIMARY KEY,
            original_time DATETIME,
            requested_time DATETIME,
            reason TEXT,
            course_id INT,
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            new_time DATETIME,
            FOREIGN KEY (course_id) REFERENCES Course(course_id)
        );    
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creating reschedulerequest table:', err);
            throw err;
        }
        console.log('RescheduleRequest table created or already exists');
    });
};

// Function to fetch all pending reschedule requests with course title
/**
 * Fetches all pending reschedule requests along with course details.
 * @function
 * @param {Function} callback - The callback function that handles the response.
 * @returns {void}
 */
const getPendingRequests = (callback) => {
    const query = `
        SELECT 
            rr.reschedule_request_id,
            rr.original_time,
            rr.requested_time,
            rr.reason,
            rr.course_id,
            rr.status,
            rr.new_time,
            c.Course_title,
            c.Course_code
        FROM 
            reschedule_requests rr
        JOIN 
            Course c ON rr.course_id = c.course_id
        WHERE 
            rr.status = 'pending';
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching pending reschedule requests:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

/**
 * Approves a reschedule request by updating its status and setting the new time.
 * @function
 * @param {number} rescheduleRequestId - The ID of the reschedule request to approve.
 * @param {Function} callback - The callback function that handles the response.
 * @returns {void}
 */

const approveRescheduleRequest = (rescheduleRequestId, callback) => {
    const query = `
        UPDATE reschedule_requests 
        SET 
            status = 'approved',
            new_time = requested_time
        WHERE reschedule_request_id = ?;
    `;
    db.query(query, [rescheduleRequestId], (err, results) => {
        if (err) {
            console.error('Error approving reschedule request:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};


// Function to reject a reschedule request
/**
 * Rejects a reschedule request by updating its status.
 * @function
 * @param {number} rescheduleRequestId - The ID of the reschedule request to reject.
 * @param {Function} callback - The callback function that handles the response.
 * @returns {void}
 */
const rejectRescheduleRequest = (rescheduleRequestId, callback) => {
    const query = `
        UPDATE reschedule_requests 
        SET status = 'rejected'
        WHERE reschedule_request_id = ?;
    `;
    db.query(query, [rescheduleRequestId], (err, results) => {
        if (err) {
            console.error('Error rejecting reschedule request:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

module.exports = {
    createRescheduleRequestTable,
    getPendingRequests,
    approveRescheduleRequest,
    rejectRescheduleRequest
};
