const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProductsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Decimal128,
        required: true
    },
    brand:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    categoryId:{
        type:Number,
        required:true,
    },
    currencyId:{
        type:Number,
        required:true,
    },
    keywords:{
        type:Array,
        default:[]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
});
module.exports = Product = mongoose.model("products", ProductsSchema);
