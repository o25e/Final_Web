// 서버 주소: http://localhost:8080/enter
// http://localhost:8080/list
// http://localhost:8080/content

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url =
'mongodb+srv://eeeon:0915@cluster0.oz5ftkr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
        mydb.collection('post').find().toArray().then(result => {
            console.log(result);
        })
        

        app.listen(8080, function(){
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

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// 정적 파일 라이브러리 추가
app.use(express.static("public"));


//템플릿 엔진 ejs 관련 코드 추가
// const db = require('node-mysql/lib/db');app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


// /list 요청 시 데이터 조회 코드
app.get('/list', function(req, res){
    // 몽고DB연결 시 주석 처리하기
    // conn.query("select * from post", function (err, rows, fields) {
    //     if (err) throw err;
    //     console.log(rows);
    // });

    // ejs 오류 코드
    // mydb.collection('post').find().toArray(function(err, result){
    //     console.log(result);       
    //     // ejs 사용 코드
    //     res.render('list.ejs', {data : result});
    // })

    mydb.collection('post').find().toArray().then(result=>{
        console.log(result);       
        // ejs 사용 코드
        res.render('list.ejs', {data : result});
    })
});

    // ejs 사용 전 데이터베이스 연결 코드
    // res.sendFile(__dirname + '/list.html');



    // console.log('데이터베이스를 조회합니다.');



// '/enter' 요청에 대한 처리 루틴
app.get('/enter', function(req, res){
    // enter.html 코드
    // res.sendFile(__dirname + '/enter.html');
    
    // enter.ejs 코드
    res.render('enter.ejs');
});

// '/save' 요청에 대한 post 방식의 처리 루틴
app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);

    //몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne(
        {title : req.body.title, content : req.body.content, date : req.body.someDate},
    ).then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
    });

    //MySQL DB에 데이터 저장하기
    // let sql = "insert into post (title, content, created) values(?, ?, NOW())";
    // let params = [req.body.title, req.body.content];
    // conn.query(sql, params, function (err, result) {
    //     if (err) throw err;
    //     console.log('데이터 추가 성공');
    // });
    res.send('데이터 추가 성공');
    // console.log("저장완료");
});

// '/edit' 요청에 대한 post 방식의 처리 루틴
app.post('/save', function(req, res){
    console.log(req.body);
    req.body.id = new ObjId(req.body.id);
    //몽고DB에 데이터 저장하기
    mydb
        .collection('post')
        .updateOne({_id : req.body.id}, {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}})
        .then(result => {
            console.log("수정완료");
            res.redirect('/list');
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/delete", function (req, res){
    console.log(req.body._id);
    req.body._id = new ObjId(req.body._id);
    mydb.collection('post').deleteOne(req.body)
        .then(result=>{
            console.log('삭제완료');
            res.status(200).send(); //삭제 기능이 처리되었을 때 페이지 새로고침
        })
        .catch(err =>{
            console.log(err);
            res.status(500).send(); //삭제 실패 시 예외 처리
        })
});

// '/content' 요청에 대한 처리 루틴
app.get('/content/:id', function(req, res){
    console.log(req.params.id);
    req.params.id = new ObjId(req.params.id);
    mydb
        .collection("post")
        .findOne({ _id : req.params.id })
        .then((result) => {
            console.log(result);
            res.render("content.ejs", {data : result });
        });
});

// "/edit" 요청에 대한 처리 루틴
app.get('/edit/:id', function(req, res) {
    req.params.id = new ObjId(req.params.id);
    mydb
        .collection("post")
        .findOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            res.render("edit.ejs", {data : result });
        });
});