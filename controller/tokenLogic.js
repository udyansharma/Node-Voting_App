// var User=require('../models/User.js');
var jwt=require('jsonwebtoken');
var privateKey="MYKEY";
const getToken=(email)=>{
    return new Promise(function(resolve,reject){
    const payload = {
        user: email 
      };
      jwt.sign(payload,privateKey,function(err,user_token){
          if(err){
               reject(err);
          }
          if(user_token)
            resolve(user_token);
          else{
              reject();
          }
      })
    })     
}
  const verifyToken=(token)=>{
      return new Promise(function(resolve,reject){
          console.log("token"+token);
        if(token!=null){
            jwt.verify(token,privateKey,function(err,decoded){
                if(err)
                    reject(err);
                else{
                    resolve(decoded);
                } 
            })
        }
      })
}
exports.verifyToken=verifyToken;
exports.getToken=getToken;
