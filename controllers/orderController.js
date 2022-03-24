const express = require("express");
const { ObjectId } = require("mongoose");
const { Transaction, BalanceSheetEntry, Order } = require("../models");
const db = require("../models");
module.exports = {
    getOrders:function(req,res){
        console.log(req.body)
        db.User.findOne({_id:req.body.userId}).then((user)=>{
            if(!user){
                return res.status(404).json({status:false,message: "Invalid User ID " });
            }
            else{
                var query = {}
                console.log("USER TYPE",user.type)
                if(user.type =="customer"){
                   query = { userId:user._id}
                }
                db.Order.aggregate([
                    { $lookup:
                        {
                           from: "transactions",
                           localField: "transactionId",
                           foreignField: "_id",
                           as: "transactionDetails"
                        }
                    },
                    { $lookup:
                        {
                           from: "products",
                           localField: "productId",
                           foreignField: "_id",
                           as: "productDetails"
                        }
                    },
                    { $lookup:
                        {
                           from: "currencies",
                           localField: "productDetails.currencyId",
                           foreignField: "_id",
                           as: "currencyDetails"
                        }
                    },
                    {
                        $match:query
                    }
                ]).sort({createdAt:-1})
                // db.Order.find(query)
                .then(orders=>{
                    res.status(200).json({status:true,orders:orders})
                })
                .catch(err=>{
                    console.log(err)
                    res.status(403).json({status:false,message:"Could Not Fetch user Orders"})
                })
            }
        })
    },
    refundOrder:function(req,res){
        console.log(req.body)

        db.User.findOne({_id:req.body.adminId}).then((user)=>{
            if(!user){
                return res.status(403).json({status:false,message: "Invalid Admin user ID  " });
            }   
            else{
                if(user.type=="admin"){
                    db.Order.findOne({_id:req.body.orderId}).then((order)=>{
                        if(!order){
                            return res.status(403).json({status:false,message: "Invalid Order ID" });
                        }
                        else{
                           db.Transaction.findOne({_id:order.transactionId}).then((transactionDetails)=>{
                            const refundTransaction = new Transaction({
                                userId: order.userId,
                                amount: transactionDetails.amount,
                                description:"Order Refunded",
                                currencyId:transactionDetails.currencyId,
                            })
                            refundTransaction.save()
                            .then((responseTransaction)=>{
                                const balanceSheetEntry = new BalanceSheetEntry({
                                    userId: order.userId,
                                    credit:transactionDetails.amount,
                                    debit:null,
                                    description:"Order Refunded",
                                    transactionId:responseTransaction._id,
                                    currencyId:responseTransaction.currencyId,
                                })
                                balanceSheetEntry.save()
                                .then((resultBalanceSheet)=>{
                                    order.status = "REFUNDED"
                                    order.save()
                                    .then((respo)=>{
                                        res.status(200).json({status:true,message:"Order Refunded Successfully "})
                                    })
                                    .catch((err)=>{
                                        console.log(error)
                                        res.status(400).json({status:false,message:"Order Refund Failed "})
                                    })
                                })
                                .catch((err)=>{
                                    console.log(error)
                                res.status(400).json({status:false,message:"Could Not create balance sheet entry "})
                                })
                            })
                            .catch((error)=>{
                                console.log(error)
                                res.status(400).json({status:false,message:"Could Not Refund Transaction! "})
                            })
                           })
                           .catch((err)=>{
                               console.log(err)
                               res.status(404).json({status:false,message:"Could not fetch Transaction Details ! "})
                           })
                        }
                    })
                    .catch((error)=>{
                        console.log(error)
                        return res.status(403).json({status:false,message: "Could Not Fetch order Details " });
                    })
                }else{
                    return res.status(403).json({status:false,message: "You Do Not have access to refund order " });
                }
            }
        })
    },
    createOrder:function(req,res){
        console.log("Creating Order ")
        console.log("Currency Check ",req.body.product.currency[0]._id)
        db.Product.findOne({ _id: req.body.product._id}).then(product => {
            if (product) {
                db.User.findOne({ _id:req.body.userId }).then(user => {
                    if (!user) {
                        return res.status(404).json({statusCode:404,status:false,message:"Invalid User ID "});
                    }
                   
                    else{
                        //check if enough balance 
                        var credit = 0
                        var debit = 0
                        var balance = 0
                        db.BalanceSheetEntry.find({userId:req.body.userId}).sort({createdAt:-1}).then(result=>{
                            console.log("Balance Sheet Result ", result )
                            result.map((entry,index)=>{
                                credit+=entry.credit
                                debit+=entry.debit
                            })
                            balance = credit - debit
                            if (balance < product.price){
                                return res.status(433).json({insuffecientBalance:true,status:false,message:"Insuffecient Wallet Balance "});
                            }
                            console.log("PRODUCT",product)
                            const transaction = new Transaction({
                                userId: req.body.userId,
                                amount: product.price,
                                description:"Order Placed ",
                                currencyId:req.body.product.currency[0]._id,
                            })
                            transaction.save()
                            .then((transactionResponse)=>{
                                const newOrder = new Order({
                                    userId: req.body.userId,
                                    quantity:1,
                                    currencyId:req.body.product.currency[0]._id,
                                    productId:req.body.product._id,
                                    transactionId:transactionResponse._id,
                                })
    
                                newOrder.save()
                                .then((orderResponse)=>{
                                    const balanceSheetEntry = new BalanceSheetEntry({
                                        userId:req.body.userId,
                                        credit: null,
                                        debit: product.price,
                                        description:"Order Placed ",
                                        transactionId:transactionResponse._id,
                                        currencyId:req.body.product.currency[0]._id,
                                    })
                                    balanceSheetEntry.save()
                                    .then((responseBalanceSheet)=>{
                                        return res.status(200).json({status:true,message: "Order Placed Successfully  !" });
                                    })
                                    .catch((error)=>{
                                        console.log(error)
                                        return res.status(400).json({status:false,message: "Failed to Create Order !" });
                                    })
                                })
                                .catch((err)=>{
                                    console.log(err)
                                    return res.status(400).json({status:false,message: "Failed to Create Order !" });
                                })
                            })
                            .catch((err)=>{
                                console.log(err)
                                return res.status(400).json({status:false,message: "Failed to process Transaction !" });
                            })
                        })
                       
                    }
                })
            } else {
                return res.status(404).json({status:false,message: "Invalid Product ID !" });
            }
        });
    }
}



