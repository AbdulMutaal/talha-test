const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Users Schema 
const OrdersSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productId:{
        type:ObjectId,
        required:false
    },
    transactionId:{
       type:ObjectId,
       required:false
    },
    status: {
       type: String,
       required:true,
       default:"PENDING",
       enum : ['COMPLETED', 'REFUNDED', 'SCHEDULED','PENDING'],
    }
},{timestamps:true});
module.exports = Order = mongoose.model("order", OrdersSchema);
