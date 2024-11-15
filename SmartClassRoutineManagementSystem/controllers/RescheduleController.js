/**
 * @module RescheduleController
 */

const { getPendingRequests, approveRescheduleRequest, rejectRescheduleRequest } = require('../models/RescheduleModel');

// Controller function to fetch all pending reschedule requests
/**
 * Controller function to fetch all pending reschedule requests.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
const fetchPendingRequests = (req, res) => {
    getPendingRequests((err, requests) => {
        if (err) {
            console.error("Error fetching pending reschedule requests:", err);
            return res.status(500).json({ error: 'Failed to fetch pending requests.' });
        }
        res.status(200).json(requests);
    });
};

// Controller function to approve a reschedule request
/**
 * Controller function to approve a reschedule request.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
const approveRequest = (req, res) => {
    const { reschedule_request_id } = req.params;
    approveRescheduleRequest(reschedule_request_id, (err, result) => {
        if (err) {
            console.error("Error approving reschedule request:", err);
            return res.status(500).json({ error: 'Failed to approve request.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found.' });
        }
        res.status(200).json({ message: 'Request approved successfully.' });
    });
};

// Controller function to reject a reschedule request
/**
 * Controller function to reject a reschedule request.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
const rejectRequest = (req, res) => {
    const { reschedule_request_id } = req.params;
    rejectRescheduleRequest(reschedule_request_id, (err, result) => {
        if (err) {
            console.error("Error rejecting reschedule request:", err);
            return res.status(500).json({ error: 'Failed to reject request.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found.' });
        }
        res.status(200).json({ message: 'Request rejected successfully.' });
    });
};

module.exports = {
    fetchPendingRequests,
    approveRequest,
    rejectRequest
};
