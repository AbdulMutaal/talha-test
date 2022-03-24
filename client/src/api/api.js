import axios from "axios";

export default {
    registerUser: function (userData) {
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/register", userData);
    },
    loginUser: function (userData) {
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/login", userData);
    },
    forgot : function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/forgot",userData)
    },
    changePassword : function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/changePassword",userData)
    },
    verifyEmail : function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/verifyEmail",userData)
    },
    sendVerificationEmail:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/sendVerificationEmail",userData)
    },
    loadWallet:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/loadWallet",userData)
    },
    getProducts:function(){
        return axios.get("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/products")
    },
    placeOrder:function(orderData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/order/create",orderData)
    },
    getOrders:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/order",userData)
    },
    refundOrder:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/order/refund",userData)
    },
    getCustomers:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user",userData)
    },
    getWallet:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/getWallet",userData)
    },
    deleteUser:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/user/delete",userData)
    },
    addBalance:function(userData){
        return axios.post("https://t1a2l3h4a5t5e3st1223.herokuapp.com/api/deposit/balance",userData)
    },
}