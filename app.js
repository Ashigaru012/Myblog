const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser');
require('date-utils');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');



const app = express();
app.use(express.urlencoded({extended: false}));
//app.use(express.urlencoded({limit:'50mb',extended: false}));

//モジュールの読み込み

//index.jsのロード
const indexRouter = require('./routes/index');

//write.jsのロード
const writeRouter = require('./routes/write');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
  host: '160.251.21.15',
  user: 'root',
  password: 'Gcc337733',
  database: 'MyBlog'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});





app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
)

app.use((req, res, next) => {
  console.log(req.session.userId);
  if (req.session.userId == undefined) {
    res.locals.username = 'ゲスト';
    
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.use('/index',indexRouter);
app.use('/write',writeRouter);
app.use(express.static('public'));

app.get('/database', (req, res) => {
  connection.query(
    'SELECT * FROM post',
    (error, results) => {
      res.render('Database_check.ejs',{post:results});
    }
  );
});


app.get('/article/:id',(req,res) =>{
  const id = req.params.id;
  console.log(id);
  let results_2;
  connection.query(
    'SELECT * FROM post WHERE id =?',
    [id],
    (error,results) =>{
      connection.query(
        'SELECT * FROM comment WHERE id=?',
        [id],
        (err,results_2) =>{
          res.render('article.ejs',{post:results[0],comments:results_2});
        });
    });
});

app.post('/comment_create',(req,res) =>{
  const id = req.body.id; 
  
  const comment = req.body.comment;
  
  let createdtime = new Date(); 
  createdtime = createdtime.toFormat("YYYY年MM月DD日HH24時MI分");
  
  connection.query(
  'INSERT INTO comment(id,comment,createdtime) VALUES(?,?,?)',
  [id,comment,createdtime],
  (error,results) =>{
    res.redirect('/article/' + id);
  }
  );
});

app.get('/login',(req,res)=>{
  res.render('login.ejs');
});

app.post('/login',(req,res)=>{
  const email = req.body.email;
  
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (results.length > 0) {
        const plain = req.body.password;
        const hash = results[0].password;
        
        bcrypt.compare(plain,hash,(err,isEqual)=>{
          console.log(plain,hash,isEqual);
          if(isEqual){
            req.session.userId = results[0].id;
            req.session.username = results[0].username;
            res.redirect('/index/1');
          }
          else{
            res.redirect('/login');
          }
        });
        /*if (req.body.password === results[0].password){
          //console.log("認証しました");
          //req.session.userId = results[0].id;
          //console.log(req.session.userId);
          //res.redirect('/index/1');
        //} else {
          //res.redirect('/login');
        }*/
      } else {
        res.redirect('/login');
      }
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy(error => {
    res.redirect('/index/1');
  });
});

app.get('/signup',(req,res)=>{
  res.render('signup.ejs');
});

/*app.post('/signup',(req,res)=>{
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, 10, (error, hash) => {
    connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash],
      (error, results) => {
        req.session.userId = results.insertId;
        req.session.username = username;
        res.redirect('/index/1');
      }
    );
  });
});*/

app.listen(3000);
