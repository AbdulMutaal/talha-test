import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import HomePage from "./home/HomePage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import Register from "./register/Register";
import Login from "./login/Login";
import ForgotPassword from './forgot/Forgot'
import News from "./news/News";
import Wallet from "./wallet/Wallet.js";
import ChangePassword from "./changePassword/ChangePassword";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from 'react-redux';
import { setCurrentUser, logOutUser } from "../redux/actions/action";
import PasswordLess from '../components/changePassword/PasswordLess'
import VerifyEmail from "./verifyEmail/verifyEmail";
import Products from "./products/products";
import Main from "./MainLayout/Main";
import Dashboard from "./dashboard/Dashboard";
import Orders from "./orders/Orders";
import Transactions from "./transactions.js/Transactions"
import Customers from "./customers/Customers";
const App = ({
    setCurrentUser,
    logOutUser
}) => {
    useEffect(() => {
        if (localStorage.jwtToken) {
            // Set auth token header auth
            const token = localStorage.jwtToken;
            setAuthToken(token);
            // Decode token and get user info and exp
            const decoded = jwt_decode(token);
            console.log(decoded);
            // Set user and isAuthenticated
            setCurrentUser(decoded);
            // Check for expired token
            const currentTime = Date.now() / 1000; // to get in milliseconds
            if (decoded.exp < currentTime) {
                console.log("true");
                logOutUser();
                window.location.href = "/login";
            }
        }
    }, [setCurrentUser, logOutUser]);
    return (
        <>
            <Switch>
                <Route exact path="/" component={Login} />
                <PrivateRoute  path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/customers" component={Customers} />
          
                <PrivateRoute  path="/orders" component={Orders} />
                <PrivateRoute  path="/wallet" component={Transactions} />
                <Route  path="/login" component={Login} />
                <PrivateRoute exact path="/products" component={Products} />
                <Route exact path="/passwordLess" component={PasswordLess} />
                <PrivateRoute exact path="/changePassword" component={ChangePassword} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/news" component={News} />
                <Route exact path="/emailverification" component={VerifyEmail} />
                <Route exact path="/forgot" component={ForgotPassword} />
             
                <Route component={PageNotFound} />
            </Switch>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
            />
        </>
    );
}

const mapDispatchToProps = {
    logOutUser: logOutUser,
    setCurrentUser: setCurrentUser,
};

export default connect(null, mapDispatchToProps)(App);
