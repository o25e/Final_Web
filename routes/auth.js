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

const sha = require('sha256');
// 계정 검사 인증 코드에 세션 적용
let session = require('express-session');
router.use(session({
    secret : 'dkufe8938493j4e0839u',
    resave : false,
    saveUninitialized : true
}));

// 로그인 라우터 구현
router.get("/login", function(req, res){
    console.log(req.session);
    if(req.session.user){
        console.log('세션 유지');
        res.render('index.ejs', {user : req.session.user});
        // res.send('로그인 되었습니다.');
    }else{
        res.render("login.ejs");
    }
});

router.post("/login", function(req, res){
    console.log("아이디 : " + req.body.userid);
    console.log("비밀번호 : " + req.body.userpw);

    mydb
        .collection("account")
        .findOne({userid : req.body.userid})
        .then((result) => {
        if(result && result.userpw == sha(req.body.userpw)){
            req.session.user = req.body;
            console.log("로그인 성공");
            res.render('index.ejs', {user : req.session.user});
            // res.send('로그인 되었습니다.');
        }else{
            console.log("로그인 실패");
            res.render('login.ejs', {error : "아이디 또는 비밀번호가 올바르지 않습니다."});
            // res.send('비밀번호가 틀렸습니다.');
        }
    });
});

// 로그아웃 구현
router.get("/logout", function (req, res){
    console.log("로그아웃");
    req.session.destroy();
    res.render('index.ejs', {user : null});
    // res.redirect("/");
});

// 회원가입 페이지 호출 라우터
router.get("/signup", function(req, res){
    res.render("signup.ejs");
});

router.post("/signup", function(req, res){
    // + 모든 입력란 채우도록 하기
    const userid = req.body.userid.trim();
    const userpw = req.body.userpw.trim();
    const usergroup = req.body.usergroup.trim();
    const usermail = req.body.usermail.trim();

    if (!userid || !userpw || !usergroup || !usermail) {
        return res.render("signup.ejs", { error: "모든 항목을 반드시 채워주세요." });
    }

    console.log(req.body.userid);
    console.log(sha(req.body.userpw)); // SHA 알고리즘으로 회원가입 비밀번호 암호화
    console.log(req.body.usergroup);
    console.log(req.body.usermail);

    mydb
        .collection("account")
        .insertOne({
            userid : userid,
            userpw : sha(userpw),
            usergroup : usergroup,
            usermail : usermail,
        })
        .then((result) => {
            console.log("회원가입 성공");
        });
    res.redirect("/");
});

// router 변수 외부로 노출시키기
module.exports = router;