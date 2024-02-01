// import { userRouter } from './src/routes/user.route.js';
import { sentimentRouter } from './src/routes/sentiment.route.js';
import { alarmtRouter } from './src/routes/sentiment.route.js';
// import { searchRouter } from './src/routes/search.route.js';
// import { rankRouter } from './src/routes/rank.route.js';

import { specs } from './config/swagger.config.js';
import { status } from './config/response.status.js';
import { response } from './config/response.js';
// import { setUserInLocals } from './src/controllers/user.controller.js';

import SwaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
// import session from 'express-session';
// import axios from 'axios';

dotenv.config();    // .env 파일 사용 (환경 변수 관리)

const app = express();

// server setting - veiw, static, body-parser etc..
app.set('port', process.env.PORT || 3000)   // 서버 포트 지정
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({extended: false})); // 단순 객체 문자열 형태로 본문 데이터 해석
/*
app.use(
  session({
    secret: '',
    resave: false,
    saveUninitialized: true
  })
);
app.use(setUserInLocals);
*/
//swagger settings
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));

// router setting
// app.use('/users', userRouter);
// app.use('/users/:userId', userRouter);
app.use('/sentiments', sentimentRouter);
app.use('/:userId/notifications', alarmtRouter);
app.use('/users/:userId/notifications/:alarmId', alarmtRouter);
// app.use('/sentiments/:sentimentId', sentimentRouter);
/* 
app.use('/search', searchRouter);
app.use('/ranks/', rankRouter);
app.use('/search', searchRouter);
*/
/*
// 네이버 검색 API 예제 - 책 검색
const client_id = 'yFYCUKN3fb2RGTD9IWM2';
const client_secret = 't6jTrLLNcA';

app.get('/search/book', async function (req, res) {
    const api_url = 'https://openapi.naver.com/v1/search/book?query=' + encodeURI(req.query.query);
  
    try {
      const response = await axios.get(api_url, {
        headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
      });
  
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response.status).end();
      console.error('error = ' + error.response.status);
    }
  });*/

// 기존 코드
app.get('/', (req, res, next) => {
    res.send(response(status.SUCCESS, "루트 페이지!"));
})

app.use((err, req, res, next) => {
    // 템플릿 엔진 변수 설정 
    res.locals.message = err.message;   
    // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; 
    console.log("error", err);
    res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
});