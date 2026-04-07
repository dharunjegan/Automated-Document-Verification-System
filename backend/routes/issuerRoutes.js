const express = require('express');
const multer = require('multer');
const { issueDocument, registerOrganization } = require('../controllers/issuerController');
const { protect, issuerOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Files temporarily saved in uploads folder

router.post('/register-org', protect, issuerOnly, registerOrganization);
router.post('/issue', protect, issuerOnly, upload.single('document'), issueDocument);

module.exports = router;
