const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { uploadDocument, listDocuments } = require('../controllers/documentController');

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/', auth, listDocuments);

module.exports = router;
