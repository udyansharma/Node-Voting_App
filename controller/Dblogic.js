var mongoose=require('mongoose');
var mongoDB='mongodb://127.0.0.1/votingdb';
mongoose.connect(mongoDB);
const User = require('../models/User.js');
const Ques= require('../models/Question.js');

const insertUser= (email,password,callback)=>{
    const u1=new User({email:email,password:password,state:false});
    u1.save(function(err,u1){
        if(err)
            return callback(err,null);
        return callback(null,u1);
    });
}

const findUser=(email,password)=>{
    return new Promise(function(resolve,reject){
       
        User.findOne({email:email,password:password},function(err,found_user){
           
            if(err)
                reject(err);
            else{
                if(found_user && found_user.state)
                    resolve(found_user);
                else if(found_user && !found_user.state){
                    reject("Kindly Verify First");
                }
                else
                    reject("User Not Found");
            }
        })
    })
}
const authenticateUser=(email)=>{
    return new Promise(function(resolve,reject){
        const query={email:email};
        User.update(query,{$set:{state:true}},function(err,msg){
            if(err)
                reject(err);
            else
                resolve(msg);
        });
    });
}
const getQuestion=()=>{
    return new Promise(function(resolve,reject){
        Ques.find({},function(err,res_set){
            console.log("in getQuestuion",err,res_set)
            if(err)
                reject(err)
            else{
                resolve(res_set)    
            }
        });
    });
}
const updateVotes=(question,vote)=>{
    return new Promise(function(resolve,reject){
      console.log("question",question)
      console.log("vote",vote)
      var search_query={question:question,'answers.con':vote}
      console.log("search",search_query)
        Ques.updateOne(search_query,{$inc:{'answers.$.votes':1}},function(err,msg){
            if(err)
             reject(err)
            else
             resolve(msg)
        })
    })
}
const insertnewResponse=(question,vote)=>{
    return new Promise(function(resolve,reject){
        var obj={con:vote,votes:1}
        Ques.update({question:question},{$push:{answers:obj}},function(err,msg){
            if(msg)
                resolve(msg);
            else
                reject(err);
        })
    })
}
    
exports.insertUser = insertUser;
exports.findUser = findUser;
exports.getQuestion= getQuestion;
exports.authenticateUser= authenticateUser;
exports.updateVotes= updateVotes;
exports.insertnewResponse= insertnewResponse;