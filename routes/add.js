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

// '/enter' 요청에 대한 처리 루틴
router.get('/enter', function(req, res){
    // enter.html 코드
    // res.sendFile(__dirname + '/enter.html');
    
    // enter.ejs 코드
    res.render('enter.ejs');
});

// '/save' 요청에 대한 post 방식의 처리 루틴
router.post('/save', function(req, res){
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        date: req.body.someDate,
        path: imagepath
    };

    //몽고DB에 데이터 저장하기
    mydb.collection('post').insertOne(newPost)
    .then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
        imagepath = '';  // 저장 후 이미지 경로 초기화
        res.redirect("/list"); // 데이저 저장 완료 시 자동으로 페이지 넘어가기
    });

    //MySQL DB에 데이터 저장하기
    // let sql = "insert into post (title, content, created) values(?, ?, NOW())";
    // let params = [req.body.title, req.body.content];
    // conn.query(sql, params, function (err, result) {
    //     if (err) throw err;
    //     console.log('데이터 추가 성공');
    // });
    // res.send('데이터 추가 성공');
    
    // console.log("저장완료");
});

// multer 라이브러리 사용
let multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination : function(req, file, done){
        done(null, './public/image')
    },
    filename: function(req, file, done){
        done(null, file.originalname)
    }
});

let upload = multer({storage : storage});
let imagepath = '';

// 이미지
router.post('/photo', upload.single('picture'), function(req, res){
    // 파일이 선택되지 않은 경우
    if (!req.file) {
        return res.send(`
            <script>
                alert("이미지를 먼저 선택해주세요.");
                window.history.back();
            </script>
        `);
    }
    // console.log("req.file.path");
    // imagepath = '\\' + req.file.path;

    // 업로드된 파일명 추출
    const filename = path.basename(req.file.path);

    // 웹에서 접근 가능한 경로로 저장 (ex: /image/파일명)
    imagepath = `/image/${filename}`;
    console.log("이미지 경로:", imagepath);

    // 업로드 성공 여부를 함께 전달
    // res.render('enter.ejs', { uploaded: true , imagepath});
});


// router 변수 외부로 노출시키기
module.exports = router;