const express = require('express');
const router = express.Router();
const crawlerController = require('../controllers/crawlerController');

router.post('/URL', crawlerController.crawlURL);

module.exports = router;