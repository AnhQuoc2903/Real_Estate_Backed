const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

router.route('/').post(sendContactEmail);

module.exports = router;