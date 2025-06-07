// 환경변수 라이브러리 사용
const dotenv = require('dotenv').config();

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = process.env.DB_URL;
const express = require('express');
const app = express();
const sha = require('sha256');

let mydb;
mongoclient.connect(url)
    .then(client => {
        console.log('몽고DB 접속 성공');
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

// MySQL + Node.js 접속 코드
// var mysql = require("mysql");
// var conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "0915",
//     database: "myboard",
// });

// conn.connect();

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

// 쿠키 라우터
app.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if(isNaN(milk))
    {
        milk = 0;
    }
    res.cookie('milk', milk, {signed : true});
    res.send('product : ' + milk + '원');
});

app.get('/session', function(req, res){
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.cookie.milk + "원");
});


// //  세션 생성
// let session = require('express-session');
// app.use(session({
//     secret : 'dkufe8938493j4e08394u',
//     resave : false,
//     saveUninitialized : true
// }));