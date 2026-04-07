const express = require('express');
const { getPendingOrganizations, approveOrganization, rejectOrganization } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/organizations/pending', protect, adminOnly, getPendingOrganizations);
router.put('/organizations/:id/approve', protect, adminOnly, approveOrganization);
router.put('/organizations/:id/reject', protect, adminOnly, rejectOrganization);

module.exports = router;
