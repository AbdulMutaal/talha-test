const express = require("express");
const { BalanceSheetEntry } = require("../models");
const db = require("../models");
const validateDeposit = require("../validation/depositValidation");
module.exports = {
    depositBalance:function(req,res){
        const { errors, isValid } = validateDeposit(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const depositEntry = new Deposit({
            userId:req.body.userId,
            amount:req.body.amount,
            description:"Deposited in Wallet ",
            currencyId:req.body.currencyId,
        })
        depositEntry.save()
        .then(result=>{
            const balanceSheetEntry = new BalanceSheetEntry({
                userId:req.body.userId,
                debit: null,
                credit: req.body.amount,
                description:"Deposited in Wallet ",
                depositId:result._id,
                currencyId:req.body.currencyId,
            })
            balanceSheetEntry.save()
            .then((dbResult)=>{
                res.status(200).json({status:true,message:"Success"})
            })
            .catch((error)=>{
                return res.status(400).json({status:false,message:error})
            })
        }).catch(err=>{
                return res.status(400).json({status:false,message:err})
        })
    },
}



