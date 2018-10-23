var express=require('express');
var flash=require('connect-flash');
var app=express();
var cookieParser = require('cookie-parser');
var session=require('express-session');
var DBconn=require('./controller/Dblogic.js');
var Mailer=require('./controller/Mailer.js');
var Token=require('./controller/tokenLogic.js');
app.use(flash());
app.use(cookieParser());
app.set('trust proxy',1)
app.use(session({
    key:'user_id',
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:5000000,secure:false}
}))
app.use((req, res, next) => {
    if (req.cookies.user_id && !req.session.user) {
        res.clearCookie('user_id');        
    }
    next();
});
app.get('/',(req,res)=>{
    res.render('pages/index.ejs');
});

app.post('/register',(req,res)=>{
    DBconn.insertUser(req.body.email,req.body.password,(err,data)=>{
        if(err){
            res.render('pages/register.ejs',{message:req.flash('reg_err')});
        }
        if(data!=null){
          Token.getToken(req.body.email).then((promiseResult)=>{
              if(promiseResult!=null){
                Mailer.sendConfirmation(req.body.email,promiseResult);
                res.render('pages/login',{message:req.flash('user_ver')})
              }
          })
        }
    });
});
app.post('/authorize',(req,res)=>{ 
    console.log("body",req.body)
    DBconn.findUser(req.body.email,req.body.password).then((promiseResult)=>{  
        if(promiseResult){
            req.session.user=req.body.email;
            console.log("what is in the session here in authorize "+req.session.user);
            console.log("This is the pr"+promiseResult)
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
        res.render('pages/login.ejs',{message:req.flash('userver_err')});
    else{
        var token=req.query.token;
        console.log("In verify check token"+token);
        Token.verifyToken(token).then((promiseResult)=>{
            if(promiseResult && promiseResult.user){
                DBconn.authenticateUser(promiseResult.user).then((promiseDB)=>{
                    if(promiseDB){
                        res.render('pages/login.ejs',{message:req.flash('email_verified')});
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
    console.log("Managing responses "+req.session.user);
    if(req.session.user && req.cookies.user_id){
        var responses=req.body;
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
                    DBconn.updateResponses(req.session.user,item,vote).then((promiseResult2)=>{
                        if(promiseResult2){
                            res.redirect('/vote')
                        }
                    }).catch(e=>{
                        res.redirect('/welcome');
                    });
                }
                }).catch(e=>{
                    res.redirect('/welcome');
                });
        }
        else if(responses["customResponse"+i]){
            vote=responses["customResponse"+i];
        DBconn.insertnewResponse(item,vote).then((promiseResult)=>{
            if(promiseResult){
                res.redirect('/vote');
            }
        }).catch(e=>{
            res.redirect('/welcome');
        });
    }
    })
    }
    else{
        res.redirect('/logout');
    }
});
app.get('/login',(req,res)=>{
    var msg=req.query.query;
    res.render('pages/login.ejs',{message:(msg!=null?msg:"")});
}
);
app.get('/register',(req,res)=>{
    res.render('pages/register.ejs');
});   
app.get('/logout',(req,res)=>{
    if(req.session.user && req.cookies.user_id){
        res.clearCookie('user_id');
        res.redirect('/');
    }
    else{
        res.render('pages/login',{message:req.flash('logged_out')});
    }
}) ; 

app.use((req,res,next)=>{
    if(req.session.user && req.cookies.user_id){
        next();
    }else{
        res.redirect('/logout');
    }
})

app.get('/welcome',(req,res)=>{
    console.log("The session object is"+JSON.stringify(req.session.user))
        DBconn.getQuestion().then((options)=>{
            if(options){
                console.log("MESSAGE"+options)
                res.render('pages/welcome.ejs',{questions:options,message:""});
            }
        }).catch(e=>{
            console.log("here in question error",e)
            res.render('pages/welcome.ejs',{questions:"",message:e});
    })
});

app.get('/vote',(req,res)=>{
    console.log("reached in vote");
        DBconn.getUserResponses(req.session.email).then((replies)=>{
            if(replies){
                console.log("The replies are"+JSON.stringify(replies));
                res.render('pages/vote.ejs',{responses:replies,message:""});
            }
        }).catch(e=>{
        console.log("here in question error",e)
        res.render('pages/welcome.ejs',{questions:"",message:e});
    })
});
module.exports=app;
