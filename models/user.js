const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
 
let walletAddress =uuidv4();
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type:{
        type:String,
        default:'customer'
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    emailVerifiedAt:{
        type:Date,
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    walletAddress:{
        type:String,
        default:walletAddress
    }
},{timestamps:true});
module.exports = User = mongoose.model("user", UserSchema);
