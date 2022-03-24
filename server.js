const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const passport = require("passport");
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')
require("dotenv").config();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const PORT = process.env.PORT || 5000;
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(routes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

if (process.env.NODE_ENV === "production") {
    mongoose.connect("mongodb+srv://wallet:xmEM3f5dRMj6JiPN@wallet0.k1btr.mongodb.net/wallet?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => {
        console.log("🌎  ==> Connected to MongoDB Atlas");
    }).catch((err) => {
        console.log("Database Connection Error  ", err);
    });

app.listen(PORT, function () {
    console.log(`🌎  ==>  Node Server Started On Port  ${PORT}!`);
});
}
else{
    mongoose.connect(process.env.MONGODB_URI_LOCAL || "mongodb://localhost/mern", { useNewUrlParser: true })
    .then(() => {
        console.log("🌎  ==> Connected to MongoDB Local");
    }).catch((err) => {
        console.log("Database Connection Error  ", err);
    });

app.listen(PORT, function () {
    console.log(`🌎  ==>  Node Server Started On Port  ${PORT}!`);
});
}

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mern", { useNewUrlParser: true })
// mongoose.connect("mongodb+srv://wallet:xmEM3f5dRMj6JiPN@wallet0.k1btr.mongodb.net/wallet?retryWrites=true&w=majority", { useNewUrlParser: true })

