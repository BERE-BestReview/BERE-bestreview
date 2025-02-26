const crawlerService = require('../services/crawlerService');

const crawlURL = async (req, res) => {
    try {
        console.log('크롤링 요청 받음:', req.body);
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL을 입력해주세요.' });
        }

        const result = await crawlerService.crawlProductPage(url);
        res.json(result);
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