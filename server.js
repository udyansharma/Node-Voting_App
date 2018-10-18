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
app.listen(8099,()=>{
    console.log("listening on port 3001")
});
