var express=require('express');
var app=express();
var session=require('express-session');
var DBconn=require('./controller/Dblogic.js');
var Mailer=require('./controller/Mailer.js');
var Token=require('./controller/tokenLogic.js');
app.set('trust proxy',1)
app.use(session({
    secret:'abc',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:5000,secure:true}
}))
app.get('/',(req,res)=>{
    res.render('pages/index.ejs');
});
/* REGISTER ROUTE */
app.post('/register',(req,res)=>{
    DBconn.insertUser(req.body.email,req.body.password,(err,data)=>{
        if(err){
            res.render('pages/register.ejs',{message:"Sorry couldn't register"});
        }
        if(data!=null){
          Token.getToken(req.body.email).then((promiseResult)=>{
              if(promiseResult!=null){
                Mailer.sendConfirmation(req.body.email,promiseResult);
                res.render('pages/login',{message:"Kindly verify"})
              }
          })
        }
    });
});

/* LOGIN ROUTE */
var sess;
app.post('/authorize',(req,res)=>{ 
    console.log("body",req.body)
    DBconn.findUser(req.body.email,req.body.password).then((promiseResult)=>{  
        if(promiseResult){
            sess=req.session;
            sess.email=req.body.email;
            console.log(promiseResult)
            res.redirect('/welcome');
        }
        else{
            res.render('pages/login.ejs',{message:'Invalid Credentials'});
        }
    }).catch(e=>{
        console.log("here in user error",e)
        res.render('pages/login.ejs',{message:e});

    })
});

/* VERIFICATION ROUTE */

app.get('/verify',(req,res)=>{
    if(!req.query)
        res.render('pages/login.ejs',{message:"Sorry couldn't Verify"});
    else{
        var token=req.query.token;
        console.log("In verify check token"+token);
        Token.verifyToken(token).then((promiseResult)=>{
            if(promiseResult && promiseResult.user){
                DBconn.authenticateUser(promiseResult.user).then((promiseDB)=>{
                    if(promiseDB){
                        res.render('pages/login.ejs',{message:"Email verified.Please login to continue"});
                    }
                }).catch(e=>{
                    res.render('/login',{message:e});
                });
            }
        });
    }
});

/*  GET VOTES*/

app.post('/getresponses',(req,res)=>{
    if(sess.email){
        var responses=req.body;
        // var allquestions={};
        // var allresponses;
    console.log("What you get is this"+JSON.stringify(req.body));
    responses.question.forEach(function(item,i){
        var vote;
        //console.log("The chosen one",responses.chosenResponse[i]);
        if(responses["chosenResponse"+i]){
            vote=responses["chosenResponse"+i];
            DBconn.updateVotes(item,vote).then((promiseResult)=>{
                console.log(promiseResult);
                if(promiseResult){
                    // allquestions;
                    res.redirect('/vote');
                }
                }).catch(e=>{
                    res.render('pages/welcome',{message:e});
                });
        }
        else if(responses["customResponse"+i]){
            vote=responses["customResponse"+i];
        DBconn.insertnewResponse(item,vote).then((promiseResult)=>{
            if(promiseResult){
                // DBconn.addUserChoice(req.session.email,item,vote);
                res.redirect('/vote');
            }
        }).catch(e=>{
            res.render('pages/welcome',{message:e});
        });
    }
    })
    }
    else{
        res.redirect('/logout');
    }
});

app.get('/vote',(req,res)=>{
    if(sess.email){

    DBconn.getQuestion().then((options)=>{
        if(options){
            res.render('pages/vote.ejs',{questions:options,message:""});
        }
    }).catch(e=>{
        console.log("here in question error",e)
        res.render('pages/welcome.ejs',{message:e});
    })
    }
    else{
        res.redirect('/logout');
    }
});
app.get('/login',(req,res)=>{
    //console.log(JSON.stringify(req.query))
    var msg=req.query.query;
    res.render('pages/login.ejs',{message:(msg!=null?msg:"")});
}
);
app.get('/register',(req,res)=>{
    res.render('pages/register.ejs');
});   
app.get('/welcome',(req,res)=>{
    if(sess.email){
        DBconn.getQuestion().then((options)=>{
            if(options){
                console.log("MESSAGE"+options)
                res.render('pages/welcome.ejs',{questions:options,message:""});
            }
        }).catch(e=>{
            console.log("here in question error",e)
            res.render('pages/welcome.ejs',{questions:"",message:e});
    })
    }
    else{
        res.redirect('/logout');
    }
    
}); 
app.get('/logout',(req,res)=>{
    sess.destroy(function(err){
        if(err)
            console.log(err);
        else
            res.render('pages/login',{message:'Please login again'});
    })
})  

module.exports=app;
