const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const extractReviews = async (frame) => {
    await frame.waitForSelector('.review_list_element', { timeout: 5000 });

    return await frame.evaluate(() => {
        const reviewElements = document.querySelectorAll('.review_list_element, .review_list li');
        return Array.from(reviewElements).map(element => {
            const reviewTextElement = element.querySelector('.cont_text_wrap .cont_review_hide, .review_cont');
            const reviewText = reviewTextElement ? reviewTextElement.textContent.trim() : '';

            const ratingElement = element.querySelector('.grade em, .score_info');
            const rating = ratingElement ? ratingElement.textContent.trim() : '평점 없음';

            const dateElement = element.querySelector('.date, .write_date');
            const date = dateElement ? dateElement.textContent.trim() : '날짜 없음';

            return {
                content: reviewText.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim(),
                rating,
                date
            };
        }).filter(review => review.content);
    });
};

app.post('/scrape', async (req, res) => {
    console.log('크롤링 요청 받음:', req.body);
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL을 입력해주세요.' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080',
                '--disable-web-security'
            ],
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.setJavaScriptEnabled(true);
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        );

        console.log('페이지 로딩 시작...');
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        await delay(3000);

        console.log('상품명 추출 중...');
        const title = await page.evaluate(() => {
            const titleElement = document.querySelector('h1.title');
            return titleElement ? titleElement.textContent.trim() : '상품명을 찾을 수 없습니다.';
        });

        console.log('리뷰 탭으로 이동 중...');
        const isReviewTabClicked = await page.evaluate(() => {
            const reviewSelectors = [
                '#tabMenuDetail2',
                'a[href="#detail_tab_review"]',
                'button:contains("상품평")',
                '.review-tab'
            ];
            
            for (const selector of reviewSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                    return true;
                }
            }
            return false;
        });

        if (!isReviewTabClicked) {
            throw new Error('리뷰 탭을 찾을 수 없습니다.');
        }

        await delay(5000);

        await page.evaluate(() => {
            window.scrollBy(0, 800);
        });

        await delay(3000);

        console.log('리뷰 추출 시도...');
        
        const frames = await page.frames();
        const uniqueReviews = new Set();
        let reviews = [];
        
        for (const frame of frames) {
            try {
                while (await frame.$('.c_product_btn.c_product_btn_more8.review-next-list') !== null) {
                    await frame.click('.c_product_btn.c_product_btn_more8.review-next-list');
                    const frameReviews = await extractReviews(frame);
                    
                    // 중복 제거
                    frameReviews.forEach(review => {
                        const reviewHash = JSON.stringify(review);
                        if (!uniqueReviews.has(reviewHash)) {
                            uniqueReviews.add(reviewHash);
                            reviews.push(review);
                        }
                    });

                    await delay(2000);
                }
            } catch (frameError) {
                console.log('프레임 처리 중 오류:', frameError.message);
            }
        }

        console.log(`추출된 리뷰 수: ${reviews.length}`);

        // 상품명에서 파일명으로 사용할 수 없는 문자 제거
        const sanitizedTitle = title.replace(/[/\\?%*:|"<>]/g, '_');

        // 결과 JSON 생성
        const result = {
            productTitle: title,
            url: url,
            scrapedAt: new Date().toISOString(),
            reviewCount: reviews.length,
            reviews: reviews
        };

        // 저장할 디렉토리 경로 설정
        const saveDirectory = path.join(__dirname, 'documents', 'result');

        // 디렉토리가 없으면 생성
        await fs.mkdir(saveDirectory, { recursive: true });

        // 파일명 생성 (상품명_날짜_시간.json 형식)
        const currentDate = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${sanitizedTitle}_${currentDate}.json`;

        // 전체 파일 경로
        const filePath = path.join(saveDirectory, fileName);

        // JSON 파일 저장
        await fs.writeFile(filePath, JSON.stringify(result, null, 2), 'utf8');
        console.log(`결과가 ${filePath}에 저장되었습니다.`);

        // 디버깅용 HTML 저장
        const debugDirectory = path.join(__dirname,'documents', 'debug');
        await fs.mkdir(debugDirectory, { recursive: true });
        await fs.writeFile(
            path.join(debugDirectory, `${sanitizedTitle}_${currentDate}.html`),
            await page.content(),
            'utf8'
        );

        // 클라이언트에 응답
        res.json({
            title,
            reviews,
            savedFile: filePath
        });

    } catch (error) {
        console.error('크롤링 중 오류 발생:', error);
        res.status(500).json({ 
            error: '크롤링 중 오류가 발생했습니다: ' + error.message
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    console.log(`리뷰 저장 경로: ${path.join(__dirname, 'documents', 'result')}`);
    console.log(`디버그 파일 저장 경로: ${path.join(__dirname, 'documents', 'debug')}`);
});