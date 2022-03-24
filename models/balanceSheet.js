const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Users Schema 
const BalanceSheetSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    debit: {
        type: Number,
        required: false
    },
    credit: {
        type: Number,
        required: false
    },
    description:{
        type:String,
       required:true
    },
    transactionId:{
        type:ObjectId,
        required:false
    },
    depositId:{
       type:ObjectId,
       required:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    currencyId: {
       type: ObjectId,
       required:true
    }
},{timestamps:true});
module.exports = BalanceSheetEntry = mongoose.model("balanceSheet", BalanceSheetSchema);
