const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 저장된 JSON 파일을 AI 서버로 전송하는 엔드포인트
router.post('/analyze/:fileName', aiController.analyzeReview);

module.exports = router;