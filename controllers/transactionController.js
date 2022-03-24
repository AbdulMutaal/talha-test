const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const db = require("../models");
const keys = require("../config/keys");
var Email = require("../email");
const transactions = require("../models/transactions");
module.exports = {
    getOrders:function(req,res){
        console.log(req.body.userId)
        db.User.findOne({_id:req.body.userId}).then((user=>{
            if(!user){
                return res.status(404).json({statusCode:404,status:false,message:"Invalid User ID, No User Found  !"});
            }
            else
            {
                if(user.type=="admin"){
                    if(req.body.type=="transactions"){
                        db.Transaction.find({}).then((result)=>{
            
                            return res.status(200).json({status:true,message:"All Orders Data ",orders:result})
                        })
                        .catch(()=>{
                            return res.status(400).json({status:false,message:"Database Error !"})
                        })
                    }
                    else{
                        db.Transaction.find({purpose:"ORDER"}).then((result)=>{
            
                            return res.status(200).json({status:true,message:"All Orders Data ",orders:result})
                        })
                        .catch(()=>{
                            return res.status(400).json({status:false,message:"Database Error !"})
                        })
                    }
                }
                else{
                    if(req.body.type=="transactions"){
                        db.Transaction.find({userID:req.body.userId}).then((result)=>{
            
                            return res.status(200).json({status:true,message:"User Transactions Data ",orders:result})
                        })
                        .catch(()=>{
                            return res.status(400).json({status:false,message:"Database Error !"})
                        })
                    }
                    else{
                        db.Transaction.find({purpose:"ORDER",userID:req.body.userId}).then((result)=>{
            
                            return res.status(200).json({status:true,message:"User Orders Data ",orders:result})
                        })
                        .catch(()=>{
                            return res.status(400).json({status:false,message:"Database Error !"})
                        })
                    }
                   
                }
            }
        }))


        
    },
    addBalance: function(req,res){
        console.log(req.body)
        db.User.findOne({_id:req.body.adminId}).then(admin=>{
            if(!admin){
                return res.status(403).json({statusCode:403,status:false,message:"Admin Account Not Found "});
            }
            else{
                if(admin.type=="admin"){
                    db.User.findOne({ _id:req.body.userId }).then(user => {
                        if (!user) {
                            return res.status(404).json({statusCode:404,status:false,message:"Invalid User ID, Not Found !"});
                        }
                        else{
                            const currentBalance =  user.walletBalance
                            user.walletBalance = (Number(user.walletBalance) + Number(req.body.amount))
                            user.save()
                            .then(()=>{
            
                                const transaction = new transactions({
                                    userID: req.body.userId,
                                    trnxType: "CREDIT",
                                    purpose: "DEPOSIT",
                                    product:{},
                                    amount:req.body.amount,
                                    balanceBefore:currentBalance,
                                    balanceAfter:parseFloat(user.currentBalance) + parseFloat(req.body.amount),
                                    transactionSummary:"Balance Loaded to Wallet ",
                                });
                                console.log("TRANS DATA",transaction)
                                transaction.save()
                                .then(()=>{
                                    return res.status(200).json({status:true,message:"Balance Added to Account !"})
                                })
                                .catch((error)=>{
                                    return res.status(400).json({status:false,message:"Failed, Transaction Failed !"})
                                })
                            })
                            .catch((error)=>{
                                console.log(error)
                                return res.status(400).json({status:false,message:"Unable to load add balance to wallet. ",error:error})
                            })
                        }
                    })
                }
                else{
                    return res.status(403).json({statusCode:403,status:false,message:"Account does not have admin access"});
                }
        }});

       
    },
    placeOrder:function(req,res){
        // const { errors, isValid } = validateRegisterInput(req.body);
        // if (!isValid) {
        //     return res.status(400).json(errors);
        // }
        console.log(true);
        console.log(req.body)
        db.Product.findOne({ _id: req.body.product._id }).then(product => {
            if (product) {
                db.User.findOne({ _id:req.body.userId }).then(user => {
                    if (!user) {
                        return res.status(404).json({statusCode:404,status:false,message:"Invalid User "});
                    }
                    else
                    {
                        const transaction = new transactions({
                            userID: req.body.userId,
                            trnxType: "DEBIT",
                            purpose: "ORDER",
                            product:req.body.product,
                            amount:product.price,
                            balanceBefore:user.walletBalance,
                            balanceAfter:user.walletBalance - product.price,
                            transactionSummary:"Purchase Product - "+product.title,
                        });
                        transaction.save()
                        .then(()=>{
                            //deducting amount from user wallet 
                            user.walletBalance = transaction.balanceAfter
                            user.save()
                            .then(()=>{
                                product.quantity = product.quantity - 1
                                product.save()
                                .then(()=>{
                                    console.log("Transaction Saved ! ")
                                    return res.status(200).json({statusCode:200,status:false,message:"order Place Successfully "});
                                })
                                .catch((err)=>{
                                    return res.status(500).json({statusCode:500,status:false,message:"Failed to place order ",error:error});
                                })
                            })
                            .catch((err)=>{
                                return res.status(500).json({statusCode:500,status:false,message:"Failed to place order ",error:error});
                            })
                        })
                        .catch((error)=>{
                            return res.status(500).json({statusCode:500,status:false,message:"Failed to place order ",error:error});
                            console.log(error)
                        })
                    }
                })
            } else {
                return res.status(404).json({status:false,message: "Invalid Product !" });
            }
        });
    }
}



