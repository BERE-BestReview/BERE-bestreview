const crawlerService = require('../services/crawlerService');
const aiService = require('../services/aiService');

const crawlURL = async (req, res) => {
    try {
        console.log('크롤링 요청 받음:', req.body);
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL을 입력해주세요.' });
        }

        const crawlResult = await crawlerService.crawlProductPage(url);
        console.log('크롤링 완료, 저장된 파일:', crawlResult.savedFile);

        if (crawlResult.savedFile && crawlResult.reviews.length > 0) {
            console.log('AI 서버로 데이터 전송 시작:', crawlResult.savedFile);
            const aiResult = await aiService.sendJsonToAI(crawlResult.savedFile);
            console.log('AI 서버 응답:', aiResult);
            crawlResult.aiResults = aiResult.results;
        } else {
            console.log('⚠️ AI 서버로 보낼 데이터가 없음');
        }

        res.json(crawlResult);
    } catch (error) {
        console.error('❌ 컨트롤러 에러:', error);
        res.status(500).json({ error: '크롤링 중 오류가 발생했습니다: ' + error.message });
    }
};

module.exports = {
    crawlURL
};