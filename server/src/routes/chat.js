const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { postMessage, getHistory } = require('../controllers/chatController');

router.post('/', auth, postMessage);
router.get('/history', auth, getHistory);

module.exports = router;
