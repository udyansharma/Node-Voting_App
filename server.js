var express=require('express');
var session=require('express-session');
var ejs=require('ejs');
var app=express();
var route = require('./routes.js');
var bodyParser=require('body-parser');


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/',route);
app.get('/flash',function(res,req){
    req.flash('login_unf','User not found')
    req.flash('reg_err',"Sorry couldn't register")
    req.flash('user_ver',"Kindly verify")
    req.flash('userver_err',"Sorry couldn't Verify")
    req.flash('email_verified',"Email verified.Please login to continue")
    req.flash('logged_out','Please login again')
    res.redirect('/');
})
app.listen(8099,()=>{
    console.log("listening on port 3001")
});
