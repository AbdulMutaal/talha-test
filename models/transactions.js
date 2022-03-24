const { ObjectId } = require('mongoose');
const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    userId: {
        type: ObjectId,
        required:true
    },
    amount: {
      type: Number,
      required: true,
    },
    description:{
        type: String, 
        required: true 
    },
    currencyId:{
      type:ObjectId,
      required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
  },
  { timestamps: true }
);
module.exports = Transaction = mongoose.model("transaction", TransactionSchema);