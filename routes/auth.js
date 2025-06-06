var router = require('express').Router();

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
        if(result.userpw == sha(req.body.userpw)){
            req.session.user = req.body;
            console.log("새로운 로그인");
            res.render('index.ejs', {user : req.session.user});
            // res.send('로그인 되었습니다.');
        }else{
            res.render('login.ejs');
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
    console.log(req.body.userid);
    console.log(sha(req.body.userpw)); // SHA 알고리즘으로 회원가입 비밀번호 암호화
    console.log(req.body.usergroup);
    console.log(req.body.usermail);

    mydb
        .collection("account")
        .insertOne({
            userid : req.body.userid,
            userpw : sha(req.body.userpw),
            usergroup : req.body.usergroup,
            usermail : req.body.usermail,
        })
        .then((result) => {
            console.log("회원가입 성공");
        });
    res.redirect("/");
})

// 쿠키 라우터
router.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if(isNaN(milk))
    {
        milk = 0;
    }
    res.cookie('milk', milk, {signed : true});
    res.send('product : ' + milk + '원');
});

router.get('/session', function(req, res){
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.cookie.milk + "원");
});

// router 변수 외부로 노출시키기
module.exports = router;