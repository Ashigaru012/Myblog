const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('date-utils');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
    console.log(res.locals.username);
    res.render('write')

});


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gcc337733',
    database: 'MyBlog'
  });

router.post('/',(req,res,next) => {
    const title = req.body.title;
    const content = req.body.content;
    let createdtime = new Date();
    createdtime = createdtime.toFormat("YYYY年MM月DD日HH24時MI分");
    connection.query(
        'insert into post (title, content, createdtime) values (?, ?, ?)',
        [title,content,createdtime],
        (error,results) =>{
            res.redirect('/index/1');
        }
    );

}


);

  module.exports = router;

 