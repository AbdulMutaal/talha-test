const express = require("express");
const db = require("../models");
module.exports = {
    getAllProducts:function(req,res){
        console.log("GET PRODUCTS")
        db.Product.aggregate([
            { $lookup:
                {
                   from: "categories",
                   localField: "categoryId",
                   foreignField: "_id",
                   as: "category"
                }
            },{
                $lookup:{
                    from :"currencies",
                    localField:"currencyId",
                    foreignField:"_id",
                    as:"currency"
                }
            }
        ]).then(result=>{
            return res.status(200).json({statusCode:200,status:true,products:result});
        }).catch(err=>{
                return res.status(404).json({statusCode:404,status:false,message:err})
            })
    },
}



