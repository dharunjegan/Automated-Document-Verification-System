const express = require('express');
const { verifyDocument } = require('../controllers/verifierController');

const router = express.Router();

// Public route to verify document by hash
router.get('/verify/:hash', verifyDocument);

module.exports = router;
