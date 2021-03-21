const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require('express-session');


const connection = mysql.createConnection({
  host: '160.251.21.15',
  user: 'R',
  password: 'Gcc#337733',
  database: 'myblog'
});

  router.use(
    session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false,
    })
  )

router.get('/',(req,res,next) => {

    connection.query(
        'select * from post order by id desc limit 0,3',
        (err,results) =>{
            connection.query(
                'select * from post',
                (err_2,results_2) =>{

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

                        res.render('index',{post:newresults,data:results_2,now_pg:1});
                    }

                }
            );



        }
    );
  });

router.get('/:page',(req,res,next)=>{
    let pg = req.params.page;
    connection.query(
        `select * from post order by id desc limit ${(pg-1)*3},3`,
        (err,results) =>{
            connection.query(
                'select * from post',
                (err_2,results_2) =>{

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
                        res.render('index',{post:newresults,data:results_2,now_pg:pg});
                    }

                }
            );
        }
    );
    

  });


  module.exports = router;
