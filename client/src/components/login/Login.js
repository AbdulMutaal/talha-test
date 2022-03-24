import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { loginUser } from "../../redux/actions/action";
import Swal from 'sweetalert2'
import API from '../../api/api';
const Login = ({ 
    history, 
    loginUser, 
    loginError,
    isAuthenticated,
    loginResponsePayload
 }) => {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isActive,setIsActive] = useState(false);

    useEffect(() => {
     
        if (isAuthenticated) {
           handleLoginSuccess()
        }
          
    }, [isAuthenticated,history]);

   useEffect(()=>{
     loginAttemptResponse();
   },[loginError])

    function handleChange(event) {
        const { name, value } = event.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setErrors(prevData => ({
            ...prevData,
            [name]: ""
        }));
    }
    function formIsValid() {
        const { email, password } = userData;
        const errors = {};

        if (!email) errors.email = "*Email is required";
        if (!password) errors.password = "*Password is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    function handleLoginSuccess(){
        setIsActive(false)
        Swal.fire({
            title: 'Success ! ',
            text: 'You Have successfully logged in to your Account ! ' ,
            icon: 'success',
            confirmButtonText: 'View Dashboard',
            confirmButtonColor:'#007bff'
          }).then(()=>{
            history.push("/products");
          })
    }
    function sendVerificationEmail(){
        API.sendVerificationEmail({email:userData.email})
        .then(()=>{
            Swal.fire({
                title: 'Email Sent ! ',
                text: 'Please check your inbox for Email Verification Link ! ' ,
                icon: 'info',
                confirmButtonText: 'Verified ? Click Here to Login Now',
                confirmButtonColor:'#007bff'
              }).then(()=>{
                history.push("/login");
              })
        })
        .catch((error)=>{
            Swal.fire({
                title: 'Email Sending Failed !',
                text: error.message,
                icon: 'warning',
                confirmButtonText: 'Close',
                confirmButtonColor:'#007bff',
             
            })
        })
    }
    function handleLoginError(){
        setIsActive(false)
        // alert(JSON.stringify(loginError))
        if(loginError.statusCode == 401)
        {
            Swal.fire({
                title: 'Email Not Verified !',
                text: loginError.message,
                icon: 'warning',
                confirmButtonText: 'Resend Email',
                confirmButtonColor:'#007bff',
                denyButtonText:'Close',
                showDenyButton:true
              }).then((value)=>{
                  if(value.isConfirmed){
                      //resend Email 
                     sendVerificationEmail()
                  }
              })
        }
        else{
            Swal.fire({
                title: 'Login Failed !',
                text: loginError.message,
                icon: 'error',
                confirmButtonText: 'Okay, Try Again ',
                confirmButtonColor:'red',
              })
        }
    }
    function loginAttemptResponse(){
        if(loginError){
           handleLoginError()
        }
        if (isAuthenticated) {
            handleLoginSuccess()
        }
    }
    function handleSave(event) {
        
        event.preventDefault();
        if (!formIsValid()) return;
        Swal.fire({
            title: 'Logging In ! ',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
        setIsActive(true)
        loginUser(userData);
       
        loginAttemptResponse()
       
    }

    return (
        <div className="register-form">
            
            <div id="auth">
        
<div class="row h-100 justify-content-center">
    <div class="col-lg-5 col-12">
        <div id="auth-left" className=''>
       
            <h1 class="auth-title">Log in.</h1>
            <p class="auth-subtitle mb-5">Login to acces your dashboard.</p>

            <form onSubmit={handleSave}>
                <div class="form-group position-relative has-icon-left mb-4">
                    <input type="text"  disabled={isActive} value={userData.email} onChange={handleChange} class="form-control form-control-xl" name="email" placeholder="Email Address"/>
                    <div class="form-control-icon">
                        <i class="bi bi-person"></i>
                    </div>
                </div>
                {errors.email ? <div className="form-error">{errors.email}</div> : null}
                <div class="form-group position-relative has-icon-left mb-4">
                    <input  disabled={isActive} value={userData.password} onChange={handleChange} type="password" class="form-control form-control-xl" name="password" placeholder="Password"/>
                    <div class="form-control-icon">
                        <i class="bi bi-shield-lock"></i>
                    </div>
                </div>
                {errors.password ? <div className="form-error">{errors.password}</div> : null}
               
                <button disabled={isActive} type='submit' class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
            </form>
            <div class="text-center mt-5 text-lg fs-4">
                <p class="text-gray-600">Don't have an account? <a onClick={()=> history.push("/register")} class="pointer font-bold">Sign
                        up</a></p>
                <p><a class="font-bold pointer" onClick={()=> history.push("/forgot")} >Forgot password?</a></p>
            </div>
            {isActive ?  <center><div className='loading-spinner'> <img width="90" src="loading.gif"/>  </div></center>: <div className='loading-spinner'></div>}
        </div>
    </div>
   
</div>

</div>
             {/* <br/>
            <h3>Log in to your account  </h3> <hr/>
            <Form onSubmit={handleSave}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder=""
                        name="email"
                        disabled={isActive}
                        value={userData.email}
                        onChange={handleChange}
                    />
                    {errors.email ? <div className="form-error">{errors.email}</div> : null}
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        disabled={isActive}
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                    />
                    {errors.password ? <div className="form-error">{errors.password}</div> : null}
                </Form.Group>
                <a onClick={()=>{history.push('/forgot')}} className="forgot-password">Forgot Password ? </a><br/><br/>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Button className='ml-10'  onClick={()=>{history.push('/register')}} variant="default" type="button">
                    Register
                </Button>
            </Form> */}
         
        </div>
    )
}

const mapDispatchToProps = {
    loginUser: loginUser,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.userReducer.isAuthenticated,
    loginResponsePayload:state.userReducer.user,
    loginError:state.userReducer.loginError
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
