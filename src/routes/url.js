const express = require('express');
const router = express.Router();
const crawlerController = require('../controllers/crawlerController');

// URL을 받아서 크롤링을 실행하는 엔드포인트
router.post('/', crawlerController.crawlURL);

module.exports = router;