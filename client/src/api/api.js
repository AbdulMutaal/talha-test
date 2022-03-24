import axios from "axios";

export default {
    registerUser: function (userData) {
        return axios.post("/api/user/register", userData);
    },
    loginUser: function (userData) {
        return axios.post("/api/user/login", userData);
    },
    forgot : function(userData){
        return axios.post("/api/user/forgot",userData)
    },
    changePassword : function(userData){
        return axios.post("/api/user/changePassword",userData)
    },
    verifyEmail : function(userData){
        return axios.post("/api/user/verifyEmail",userData)
    },
    sendVerificationEmail:function(userData){
        return axios.post("/api/user/sendVerificationEmail",userData)
    },
    loadWallet:function(userData){
        return axios.post("/api/user/loadWallet",userData)
    },
    getProducts:function(){
        return axios.get("/api/products")
    },
    placeOrder:function(orderData){
        return axios.post("/api/order/create",orderData)
    },
    getOrders:function(userData){
        return axios.post("/api/order",userData)
    },
    refundOrder:function(userData){
        return axios.post("/api/order/refund",userData)
    },
    getCustomers:function(userData){
        return axios.post("/api/user",userData)
    },
    getWallet:function(userData){
        return axios.post("/api/user/getWallet",userData)
    },
    deleteUser:function(userData){
        return axios.post("/api/user/delete",userData)
    },
    addBalance:function(userData){
        return axios.post("/api/deposit/balance",userData)
    },
}