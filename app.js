const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser');



const app = express();
app.use(express.urlencoded({limit:'50mb',extended: false}));

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
  connection.query(
    'SELECT * FROM post WHERE id =?',
    [id],
    (error,results) =>{
      res.render('article.ejs',{post:results[0]});
    }
  );
});

app.listen(3000);