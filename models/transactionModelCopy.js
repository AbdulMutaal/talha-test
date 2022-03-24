const { ObjectId } = require('mongoose');
const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    userID: {
        type: ObjectId,
        required:true
    },
    trnxType: {
      type: String,
      required: true,
      enum: ['CREDIT','DEBIT']
    },
    purpose:{
      type: String,
      enum : ['ORDER', 'WITHDRAWL', 'REFUND','DEPOSIT'],
      required: true
    },
    product:{
        type:Object,
        default:{}
    },
    amount: {
      type: mongoose.Decimal128,
      required: true,
      default: 0.00
    },
    balanceBefore: {
        type: mongoose.Decimal128,
        required: true,
    },
    balanceAfter: {
        type: mongoose.Decimal128,
        required: true,
    },
    transactionSummary:{ 
        type: String, 
        required: true 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type: String,
        enum : ['PENDING', 'COMPLETED',],
        default:"PENDING"
    }
  },
  { timestamps: true }
);
module.exports = Transaction = mongoose.model("transaction", TransactionSchema);