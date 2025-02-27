const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 저장된 JSON 파일을 AI 서버로 전송하는 엔드포인트
router.post('/analyze/:fileName', aiController.analyzeReview);

// 모든 결과 파일 조회 엔드포인트
router.get('/files', aiController.getResultFiles);

// 특정 결과 파일 내용 조회 엔드포인트
router.get('/file/:fileName', aiController.getResultFile);

module.exports = router;