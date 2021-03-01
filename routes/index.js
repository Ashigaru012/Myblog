const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gcc337733',
    database: 'MyBlog'
  });

  router.get('/',(req,res,next) => {
    connection.query(
        'select * from post order by id desc limit 0,3',
        (err,results) =>{
            console.log(err);
            if(!err && results){
                //改行コードを<br>に置換
                const newresults = results.map(result =>{
                    if(result.content){
                        result.content = result.content.replace(/\r?\n/g, '<br>');
                    }
                    return result;

                });
                console.log(newresults);
                res.render('index',{post:newresults});
            }
        }
    );
  }

  );

  module.exports = router;