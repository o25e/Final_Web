// 서버 주소: http://localhost:8080/enter
// http://localhost:8080/list
// http://localhost:8080/content

// 환경변수 라이브러리 사용
const dotenv = require('dotenv').config();

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = process.env.DB_URL;
let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
        mydb.collection('post').find().toArray().then(result => {
            console.log(result);
        })
        

        app.listen(process.env.PORT, function(){
            console.log("포트 8080으로 서버 대기중 ... ")
        });
    }).catch(err => {
        console.log(err);
    });
    console.log('몽고DB 접속 성공');

// MySQL + Node.js 접속 코드
var mysql = require("mysql");
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0915",
    database: "myboard",
});

conn.connect();

const express = require('express');
const app = express();
const sha = require('sha256');

// 계정 검사 인증 코드에 세션 적용
let session = require('express-session');
app.use(session({
    secret : 'dkufe8938493j4e0839u',
    resave : false,
    saveUninitialized : true
}))

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// 정적 파일 라이브러리 추가
app.use(express.static("public"));

// 라우터 분리
app.use('/', require('./routes/post.js'))
app.use('/', require('./routes/add.js'))
app.use('/', require('./routes/auth.js'))

//템플릿 엔진 ejs 관련 코드 추가
// const db = require('node-mysql/lib/db');app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.get("/", function (req, res){
    // res.render("index.ejs");
    if (req.session.user) {
        console.log("세션 유지");
        res.render("index.ejs", {user: req.session.user});
    }else{
        console.log("user : null");
        res.render("index.ejs", {user : null});
    }
});

// 쿠키 생성
let cookieParser = require('cookie-parser');
app.use(cookieParser('ncvka0e398423kpfd'));

// //  세션 생성
// let session = require('express-session');
// app.use(session({
//     secret : 'dkufe8938493j4e08394u',
//     resave : false,
//     saveUninitialized : true
// }));