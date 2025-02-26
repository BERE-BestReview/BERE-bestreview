const express = require('express');
const cors = require('cors');
const crawlerRoutes = require('./src/routes/crawlerRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/', crawlerRoutes);

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});