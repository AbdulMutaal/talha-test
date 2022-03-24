
const db = require("../models");
var jwt_decode = require("jwt-decode");
module.exports = {
    verifyToken: function(token,callback){
        console.log("Verifying Token : ", token)
        const decoded = jwt_decode(token)
        console.log("Decoded",decoded)
        // db.User.findOne({_id:userId}).then(user=>{
        //     callback({status:true,user:user})
        // })
        // .catch(error=>{
        //     callback({status:false,error:error})
        // })
        
    }
}