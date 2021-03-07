const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser');
require('date-utils');



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
  host: 'localhost',
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

app.use('/index',indexRouter);
app.use('/write',writeRouter);
app.use(express.static('public'));




app.get('/index', (req, res) => {
  res.render('index.ejs');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM post',
    (error, results) => {
      res.render('Database_check.ejs',{post:results});
    }
  );
});


app.get('/article/:id',(req,res) =>{
  const id = req.params.id;
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

app.listen(3000);