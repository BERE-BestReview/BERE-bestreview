const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

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

const saveResult = async (result, title) => {
    const sanitizedTitle = title.replace(/[/\\?%*:|"<>]/g, '_');
    const currentDate = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${sanitizedTitle}_${currentDate}.json`;

    const saveDirectory = path.join(__dirname, '..', '..', 'documents', 'result');
    await fs.mkdir(saveDirectory, { recursive: true });

    const filePath = path.join(saveDirectory, fileName);
    await fs.writeFile(filePath, JSON.stringify(result, null, 2), 'utf8');
    
    return filePath;
};

const crawlProductPage = async (url) => {
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

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        await delay(3000);

        const title = await page.evaluate(() => {
            const titleElement = document.querySelector('h1.title');
            return titleElement ? titleElement.textContent.trim() : '상품명을 찾을 수 없습니다.';
        });

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
        await page.evaluate(() => window.scrollBy(0, 800));
        await delay(3000);

        const frames = await page.frames();
        const uniqueReviews = new Set();
        let reviews = [];
        
        for (const frame of frames) {
            try {
                while (await frame.$('.c_product_btn.c_product_btn_more8.review-next-list') !== null) {
                    await frame.click('.c_product_btn.c_product_btn_more8.review-next-list');
                    const frameReviews = await extractReviews(frame);
                    
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

        const result = {
            productTitle: title,
            url: url,
            scrapedAt: new Date().toISOString(),
            reviewCount: reviews.length,
            reviews: reviews
        };

        const savedFilePath = await saveResult(result, title);

        return {
            title,
            reviews,
            savedFile: savedFilePath
        };

    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = {
    crawlProductPage
};