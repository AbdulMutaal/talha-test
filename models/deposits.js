const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Users Schema 
const DepositsSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description:{
        type:String,
       required:true
    },
    currencyId: {
       type: ObjectId,
       required:true
    },
    status: {
        type: String,
        default:"Approved"
     }
},{timestamps:true});
module.exports = Deposit = mongoose.model("deposit", DepositsSchema);
