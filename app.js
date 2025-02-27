const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const url = require('./routes/url');
const result = require('./src/routes/result');

app.use('/url', url);
app.use('/result', result);

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});