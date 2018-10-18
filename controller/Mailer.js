var nodemailer = require('nodemailer');
var User=require('../models/User.js');
//var token=require('../controller/tokenLogic.js');

const sendConfirmation=(email,token)=>{
  console.log("token:"+token);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'udyan.sharma@sofocle.com',
               pass: 'test@sofocle'
           }
       });
      const mailOptions = {
        from: 'sender@email.com', // sender address
        to: email, // list of receivers
        subject: 'Account Verification for Voto',
        html:"<p>Hi Please click at this link to verify your account</p><a href='http://localhost:3001/verify?token="+token+"'>Please follow this link  </a>"
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });  
}

exports.sendConfirmation=sendConfirmation;