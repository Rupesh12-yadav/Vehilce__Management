const express = require('express');
const { uploadDocument, getDocuments, approveDocument } = require('../controllers/documentController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', auth, uploadDocument);
router.get('/', auth, getDocuments);
router.put('/:id/approve', auth, checkRole(['superadmin']), approveDocument);

module.exports = router;