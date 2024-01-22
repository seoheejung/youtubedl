const express = require('express');
const app = express();
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack); // 서버 콘솔에 에러 로그를 출력
    res.status(500).send('<script type="text/javascript">alert("서버에서 에러가 발생했습니다. 확인을 누르면 메인 페이지로 이동합니다."); window.location="/";</script>');
});

// 서버 종료를 방지하기 위해 unhandledRejection 이벤트 처리
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

const server = app.listen(3000, () => {
    console.log('Server started on port 3000' + ` http://localhost:3000`);
});

server.timeout = 600000; // 10분
