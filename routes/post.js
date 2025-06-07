var router = require('express').Router();

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = process.env.DB_URL;

let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
    }).catch(err => {
        console.log(err);
    });

// /list 요청 시 데이터 조회 코드
router.get('/list', function(req, res){
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
    });
});

    // ejs 사용 전 데이터베이스 연결 코드
    // res.sendFile(__dirname + '/list.html');



    // console.log('데이터베이스를 조회합니다.');

// '/content' 요청에 대한 처리 루틴
router.get('/content/:id', function(req, res){
    console.log(req.params.id);
    req.params.id = new ObjId(req.params.id);
    mydb
        .collection("post")
        .findOne({ _id : req.params.id })
        .then((result) => {
            console.log(result);
            let imagePath = "";
            if (result.path && result.path.trim() !== "") {
                // 이미지 라우터 코드 변경 (이미지 경로 변경) -> OS 무관하게
                imagePath = result.path.replace(/(\\|\/)?public(\\|\/)image(\\|\/)?/, "/image/");
            }
            res.render("content.ejs", {data: { ...result, path: imagePath}});
            // res.render("content.ejs", {data : result });
        });
});    

// "/edit" 요청에 대한 처리 루틴
router.get('/edit/:id', function(req, res) {
    req.params.id = new ObjId(req.params.id);
    mydb
        .collection("post")
        .findOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            if (result.path) {
                result.path = result.path.replace(/(\\|\/)?public(\\|\/)image(\\|\/)?/, "/image/");
            }
            res.render("edit.ejs", {data : result });
        });
});

// '/edit' 요청에 대한 post 방식의 처리 루틴
router.post('/edit', function(req, res){
    const updateId = new ObjId(req.body.id);

    //몽고DB에 데이터 저장하기
    mydb
        .collection('post')
        .updateOne({_id : updateId}, {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}})
        .then(result => {
            console.log("수정완료");
            res.redirect('/list');
    })
    .catch((err) => {
        console.log(err);
    });
});

// 검색 라우터
router.get('/search', function(req, res){
    console.log(req.query);
    mydb
    .collection("post")
    .find({title: req.query.value}).toArray()
    .then((result) => {
        console.log(result);
        result = result.map(post => {
            post.path = post.path.replace(/\\public\\image\\/, "/image/");
            return post;
        })
        res.render("sresult.ejs", {data: result});
    })
});

// 삭제 라우터
router.post("/delete", function (req, res){
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

// router 변수 외부로 노출시키기
module.exports = router;