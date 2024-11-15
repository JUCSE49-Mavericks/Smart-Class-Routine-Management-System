// routes/rescheduleRoutes.js
const express = require('express');
const { fetchPendingRequests,
    approveRequest,
    rejectRequest } = require('../controllers/RescheduleController');

const router = express.Router();

// Route to get all pending reschedule requests
router.get('/pending-rescheduling-requests', fetchPendingRequests);

// Route to approve a reschedule request
router.put('/approve-reschedule-request/:reschedule_request_id', approveRequest);

// Route to reject a reschedule request
router.put('/reject-reschedule-request/:reschedule_request_id', rejectRequest);

module.exports = router;
