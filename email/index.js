const res = require('express/lib/response');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4fea0202a88bd5",
    pass: "95a48e66ac5d98"
  }
});
module.exports = {
    SendVerificationEmail:function(email,link,callback){
      var mailOptions = {
        from: 'mernproject1234@gmail.com',
        to: email,
        subject: 'Verify Your Email Address ',
        html : '<center style="font-family: Arial, Helvetica, sans-serif;"><h1> Click the link below to Verify Your Email Address :  </h1> <br/><br/><p> <a href="'+link+'">Click Here to Verify Your Email  </a></p></center>'
      };
      console.log(mailOptions)
    
    transporter.sendMail(mailOptions, function(error, info){ 
        if (error) {
          console.log("Email Sending Error", error);
          callback({status:false,message:"Could not Send Verification Email ! ",error:error})
        } else {
          console.log('Email Sent Response : ', info.response);
          callback({status:true,message:"Verification Email Sent  !"})
        }
    });
    },
    SendPasswordResetEmail: function(email,callback){
        var mailOptions = {
            from: 'mernproject1234@gmail.com',
            to: email,
            subject: 'Project Password Reset Link ',
            html : '<center style="font-family: Arial, Helvetica, sans-serif;"><h1> MERN Password Reset Link </h1> <br/><br/><p> <a href='+process.env.REACT_APP_URL+'/forgot">Click Here to Reset Password  </a></p></center>'
          };
          console.log(mailOptions)
         
      
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log("Email Sending Error", error);
              callback({status:false,message:"Could not Send Password Reset Email ! ",error:error})
            } else {
              console.log('Email sent Response : ', info.response);
              callback({status:true,message:"Reset Email Sent !"})
            }
        });
        
    }
}