const crawlerService = require('../services/crawlerService');
const aiService = require('../services/aiService');

const crawlURL = async (req, res) => {
    try {
        console.log('크롤링 요청 받음:', req.body);
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL을 입력해주세요.' });
        }

        // 크롤링 수행
        const crawlResult = await crawlerService.crawlProductPage(url);
        
        // 저장된 JSON 파일을 AI 서버로 전송
        if (crawlResult.savedFile && crawlResult.reviews.length > 0) {
            console.log('AI 서버로 리뷰 데이터 전송 시도:', crawlResult.savedFile);
            const aiResult = await aiService.sendJsonToAI(crawlResult.savedFile);
            crawlResult.aiResults = aiResult.results;
        }
        
        // 결과 반환
        res.json(crawlResult);
        
    } catch (error) {
        console.error('컨트롤러 에러:', error);
        res.status(500).json({ 
            error: '크롤링 중 오류가 발생했습니다: ' + error.message 
        });
    }
};

module.exports = {
    crawlURL
};