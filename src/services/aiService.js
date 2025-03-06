const axios = require('axios');
const fs = require('fs').promises;
const FormData = require('form-data');

const AI_SERVER_URL = 'http://localhost:8000'; // AI 서버 URL 설정

// JSON 파일 내용을 AI 서버로 전송
const sendJsonToAI = async (filePath) => {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const reviewData = JSON.parse(fileContent);
        
        console.log(`🚀 AI 서버로 보낼 JSON 파일 로드 완료: ${filePath}`);
        console.log(`📌 총 리뷰 개수: ${reviewData.reviews.length}`);

        const results = {
            detectionResults: [],
            summaryResults: []
        };

        for (const review of reviewData.reviews) {
            try {
                console.log(`🔎 리뷰 처리 중: ${review.content.substring(0, 50)}...`);

                // ✅ 1. 가짜 리뷰 판별 API 호출
                const detectFormData = new FormData();
                detectFormData.append('review_text', review.content);

                console.log('📡 AI 서버로 가짜 리뷰 판별 요청 전송...');
                const detectResponse = await axios.post(
                    `${AI_SERVER_URL}/detect_review`,
                    detectFormData,
                    { headers: { ...detectFormData.getHeaders() } }
                );
                console.log('✅ AI 서버 응답 (가짜 리뷰 판별):', detectResponse.data.result);

                results.detectionResults.push({
                    reviewId: review.date,
                    content: review.content.substring(0, 50) + '...',
                    result: detectResponse.data.result
                });

                // ✅ 2. 리뷰 요약 API 호출
                const summaryFormData = new FormData();
                summaryFormData.append('review_text', review.content);

                console.log('📡 AI 서버로 리뷰 요약 요청 전송...');
                const summaryResponse = await axios.post(
                    `${AI_SERVER_URL}/summarize_review`,
                    summaryFormData,
                    { headers: { ...summaryFormData.getHeaders() } }
                );
                console.log('✅ AI 서버 응답 (리뷰 요약):', summaryResponse.data.summary);

                results.summaryResults.push({
                    reviewId: review.date,
                    content: review.content.substring(0, 50) + '...',
                    summary: summaryResponse.data.summary
                });

                await new Promise(resolve => setTimeout(resolve, 500)); // 요청 간격 조절

            } catch (error) {
                console.error(`❌ 리뷰 분석 중 오류 (리뷰: ${review.content.substring(0, 30)}...):`, error.message);
            }
        }

        return {
            success: true,
            message: '리뷰 데이터가 AI 서버로 전송되었습니다.',
            results: results
        };
    } catch (error) {
        console.error('❌ AI 서버 전송 중 오류:', error.message);
        return {
            success: false,
            error: 'AI 서버 전송에 실패했습니다: ' + error.message
        };
    }
};


module.exports = {
    sendJsonToAI
};