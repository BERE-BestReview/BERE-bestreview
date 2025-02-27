const fs = require('fs').promises;
const path = require('path');
const aiService = require('../services/aiService');

// 저장된 JSON 파일을 AI 서버로 전송
const analyzeReview = async (req, res) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '..', '..', 'documents', 'result', fileName);
        
        // 파일 존재 확인
        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
        }
        
        // AI 서버 전송
        console.log('AI 서버로 리뷰 데이터 전송 시도:', filePath);
        const aiResult = await aiService.sendJsonToAI(filePath);
        
        res.json({
            success: true,
            fileName,
            results: aiResult.results
        });
    } catch (error) {
        console.error('AI 분석 중 오류:', error);
        res.status(500).json({ error: 'AI 분석 중 오류가 발생했습니다: ' + error.message });
    }
};

// 모든 결과 파일 목록 조회
const getResultFiles = async (req, res) => {
    try {
        const resultDir = path.join(__dirname, '..', '..', 'documents', 'result');
        const files = await fs.readdir(resultDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        res.json({
            success: true,
            files: jsonFiles
        });
    } catch (error) {
        console.error('파일 목록 조회 중 오류:', error);
        res.status(500).json({ error: '파일 목록 조회 중 오류가 발생했습니다.' });
    }
};

// 특정 결과 파일 내용 조회
const getResultFile = async (req, res) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '..', '..', 'documents', 'result', fileName);
        
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            res.json(JSON.parse(fileContent));
        } catch (error) {
            res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('파일 조회 중 오류:', error);
        res.status(500).json({ error: '파일 조회 중 오류가 발생했습니다.' });
    }
};


module.exports = {
    analyzeReview,
    getResultFiles,
    getResultFile
};