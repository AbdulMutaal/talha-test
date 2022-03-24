const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateForgotPassword = require("../validation/forgotPassword");
const validateChangePasswordInput = require('../validation/changePassword')
const validateEmailVerification = require('../validation/verifyEmail')
const db = require("../models");
const keys = require("../config/keys");
var Email = require("../email")
const Token = require("./token")
var jwt_decode = require("jwt-decode");
module.exports = {
    getWalletDetails:function(req,res){
        console.log(req.body)
        db.User.findOne({_id:req.body.userId}).then(user=>{
            if(!user){
                return res.status(403).json({statusCode:403,status:false,message:"Invalid User ID"});
            }
            else{
                db.BalanceSheetEntry.find({userId:req.body.userId}).sort({createdAt:-1})

                // db.BalanceSheetEntry.aggregate([
                   
                //     {
                //         $match:{userId:req.body.userId}
                //     },
                //     { $lookup:
                //         {
                //            from: "currencies",
                //            localField: "currencyId",
                //            foreignField: "_id",
                //            as: "currency"
                //         }
                //     },
                // ])
                .then((result)=>{
                    res.status(200).json({status:true,result:result})
                })
                .catch(error=>{
                    res.status(400).json({status:false,error:error})
                })
            }
        })
    },
    deleteUser:function (req,res){
        console.log(req.body)
        db.User.findOne({_id:req.body.adminId}).then(admin=>{
            if(!admin){
                return res.status(403).json({statusCode:403,status:false,message:"Invalid Admin ID "});
            }
            else{
                if(admin.type=="admin"){
                    db.User.deleteOne({_id:req.body.userId}).then(response=>{
                        console.log(response.deletedCount)
                        if(response.deletedCount > 0){
                            return res.status(200).json({status:true,message:"User Deleted Successfully "})
                        }
                        return res.status(403).json({status:false,message:"Invalid User ID, No Account Found"})
                    })
                    .catch(error=>{
                        return res.status(400).json({status:false,message:error})
                    })
                }   
                else{
                    return res.status(403).json({statusCode:403,status:false,message:"Account does not have admin access"});
                }
            }
        })
        .catch(error=>{
            return res.status(403).json({statusCode:403,status:false,message:error});
        })
    },
    getCustomers:function(req,res){
        console.log("CUSTOMERS DATA",req.body)
        db.User.findOne({_id:req.body.adminId}).then(user=>{
            if(!user){
                return res.status(403).json({statusCode:403,status:false,message:"Invalid Admin ID"});
            }
            else{
                if(user.type=="admin"){
                    db.User.find({type:"customer"}).then(result=>{
                        return res.status(200).json({customers:result,statusCode:200,status:true,message:"Success!"})
                    })
                    .catch((error)=>{
                        return res.status(400).json({status:false,message:"Could not fetch Users ",error:error})
                    })
                }
                else{
                    return res.status(403).json({statusCode:403,status:false,message:"This account does not have Admin Access"});
                }
            }
        }).catch(error=>{
            return res.status(400).json({statusCode:400,status:false,message:"Error fetching Customer Data ! ",error:error});
        })
    },
    loadWallet:function(req,res){
        console.log("User ID",req.body.userId)
        db.User.findOne({ _id:req.body.userId }).then(user => {
            if (!user) {
                return res.status(404).json({statusCode:404,status:false,message:"No User found with this Email !"});
            }
            else{
                var details = user
                details.password = null
                return res.status(200).json({userDetails:details,statusCode:200,status:true,message:"Success!"})
            }
        })
    },
    sendVerificationEmail:function (req, res) {
        const email = req.body.email;
        db.User.findOne({ email }).then(user => {
            if (!user) {
                return res.status(404).json({statusCode:404,status:false,message:"No User found with this Email !"});
            }
            const payload = {
                id: user._id,
                name: user.name,
                emailVerified:user.emailVerified,
            };
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 30000 
                },
                (err, token) => {
                    var link = +process.env.REACT_APP_URL+'/emailverification?uid='+token
                    Email.SendVerificationEmail(user.email,link,function(response){
                        if(response.status){
                            return res.status(200).json({status:true, message: "Verification Email Sent, Please Check Your Inbox ! " });
                        }
                        else
                        {
                            console.log(response)
                            return res.status(400).json({status:false, message: "Could Not Send Verification Email  ",error:response.error});
                        }
                    })
                }   
            );
        });
    },
    verifyEmail:function(req,res){
        const { errors, isValid } = validateEmailVerification(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        console.log(true);
        db.User.findOne({_id:Object(req.body.userId)}).then(user=>{
            if(user){
                user.emailVerified = true
                user.emailVerifiedAt = Date.now()
                user
                .save()
                .then(()=> {return res.status(200).json({status:true,message:'Email Verified Successfully '})})
                .catch(err => {return res.status(400).json({status:false,message:'Could Not Verify Email',error:err});});
            }
        })
    },
    changePassword:function(req,res){
        const token = req.headers.authorization
        console.log("Token",token)
        if(!token){
            return res.status(403).json({status:false,message:"Invalid Token ! "});
        }
        Token.verifyToken(token)
        const { errors, isValid } = validateChangePasswordInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        console.log(true);
        db.User.findOne({_id:Object(req.body.userId)}).then(user=>{
            if(user){
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user
                        .save()
                        .then(()=> {return res.status(200).json({status:true,message:'Password Updated Successfully ! '})})
                        .catch(err => {return res.status(400).json({status:false,message:'Could not Update Password',error:err});});
                    });
                });    
            }
        });
    },
    forgot: function (req, res) {
        const { errors, isValid } = validateForgotPassword(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        console.log(true);
        db.User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                Email.SendPasswordResetEmail(req.body.email,function(response){
                    console.log(response)
                    if(response.status){
                        return res.status(200).json({ message: "Password Link Sent to Your Email ! " });
                    }
                    else
                    {
                        console.log(response)
                        return res.status(400).json({ message: "Could Not Send Password Reset Email ",error:response.error});
                    }
                })
            } else {
                return res.status(404).json({ message: "Account Not Found With This Email Address !" });
            }
        });
    },
    register: function (req, res) {
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        console.log(true);
        db.User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.status(400).json({alreadyExists:true, message: "Email Already Exists ! " });
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                console.log("Registered User",user)
                                const payload = {
                                    id: user._id,
                                    name: user.name,
                                    emailVerified:user.emailVerified,
                                };
                                jwt.sign( payload,
                                    keys.secretOrKey,
                                    {
                                        expiresIn: 30000 
                                    },
                                    (err, token) => {
                                        var link = 'http://localhost:3000/emailverification?uid='+token
                                        Email.SendVerificationEmail(user.email,link,function(response){
                                            if(response.status){
                                                return res.status(200).json({status:true, message: "Verification Email Sent  ! " });
                                            }
                                            else
                                            {
                                                console.log(response)
                                                return res.status(400).json({status:false, message: "Could Not Send Verification Email  ",error:response.error});
                                            }
                                        })
                                    }
                                );
                               
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    },
    login: function (req, res) {
        const { errors, isValid } = validateLoginInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        
        const email = req.body.email;
        const password = req.body.password;
        db.User.findOne({ email }).then(user => {
            if (!user) {
                return res.status(404).json({statusCode:404,status:false,message:"No User found with this Email !"});
            }
            bcrypt.compare(password, user.password).then(isMatch => {

                if (isMatch) {
                   
                    if(!user.emailVerified){
                        return res.status(401).json({statusCode:401,message:"Email Not Verified, Please Verify Your email address to Continue !",statue:false,emailVerified:false});
                    }
                 
                    const payload = {
                        id: user._id,
                        name: user.name,
                        emailVerified:user.emailVerified,
                        type:user.type,
                        walletAddress:user.walletAddress
                        
                    };
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 30000 
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                userID:user._id,
                                type:user.type,
                                walletAddress:user.walletAddress,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    return res
                        .status(400)
                        .json({statusCode:400,status:false,message:"Invalid Email/Password, Please Try Again"});
                }
            });
        });
    },
}



