import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logOutUser } from "../../redux/actions/action";
import Header from '../common/Header'
import API from "../../api/api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import Sidebar from "../common/Sidebar"
function ChangePassword({ history, logOutUser}) {
    const [userData, setUserData] = useState({ password: "",confirmPassword:"",userId:""});
    const [errors, setErrors] = useState({});
    const [isActive,setIsActive] = useState(false);
  
    useEffect(()=>{
        if (localStorage.jwtToken) {
            const token = localStorage.jwtToken;
            // Decode token and get user info and exp
            const decoded = jwt_decode(token);    
            setUserData(prevState => ({
                ...prevState,
                userId: decoded.id,
            }))       
        }
    },[])
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
        const {  password,confirmPassword } = userData;
        const errors = {};
  
        if (!password) errors.password = "*Password is required";
        if (!confirmPassword) errors.confirmPassword = "*Confirm password is required"
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    function handleSave(event) {
     
        event.preventDefault();
        if (!formIsValid()) return;
        Swal.fire({
            title: 'Changing Password  ! ',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
        setIsActive(true)
        API.changePassword(userData)
            .then((response) => {
                setIsActive(false)
                Swal.fire({
                    title: 'Password Changed !',
                    text: 'You Password Has Been Updated Successfully, Please Login Again ! ',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'#007bff'
                  }).then(()=>{
                    logOutUser();
                    setUserData({password: "",confirmPassword:"" });
                    history.push("/login");
              })
            })
            .catch((err) => {
                setIsActive(false)
                console.log(err.response.data);
                toast.error()
                Swal.fire({
                    title: 'Failed ! ',
                    text: err.response.data.message ,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'red'
                  })
            })
     
    }

    return (
        <>
         <Sidebar />
        <div className="register-form">
            
        <div id="auth">
        
        <div class="row h-100 justify-content-center">
            <div class="col-lg-5 col-12"><br/>
                <div id="auth-left" className=''>
               
                    <h1 class="auth-title">Password.</h1>
                    <p class="auth-subtitle mb-5">Change Your Password </p>
        
                    <form onSubmit={handleSave}>
                        <div class="form-group position-relative has-icon-left mb-4">
                            <input type="password"  disabled={isActive} value={userData.password} onChange={handleChange} class="form-control form-control-xl" name="password" placeholder="New Password"/>
                            <div class="form-control-icon">
                            <i class="bi bi-shield-lock"></i>
                            </div>
                        </div>
                        {errors.password ? <div className="form-error">{errors.password}</div> : null}
                        <div class="form-group position-relative has-icon-left mb-4">
                            <input type="password" disabled={isActive} value={userData.confirmPassword} onChange={handleChange} class="form-control form-control-xl" name="confirmPassword" placeholder="Re-Enter New Password "/>
                            <div class="form-control-icon">
                                <i class="bi bi-shield-lock"></i>
                            </div>
                        </div>
                        {errors.password ? <div className="form-error">{errors.confirmPassword}</div> : null}
                       
                        <button disabled={isActive} type='submit' class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Update Password</button>
                    </form>
                    
                    
                </div>
            </div>
           
        </div>
        
        </div>

              {/* <br/>
            <h3>Change Account Password </h3>
            <hr/>
            <Form onSubmit={handleSave}>
                
           
            <Form.Group controlId="formBasicPassword">
                    <Form.Label><b>New Password</b></Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter New Password "
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                    />
                    {errors.password ? <div className="form-error">{errors.password}</div> : null}
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label><b>Confirm New Password</b></Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Re-Enter New Password "
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                />
                {errors.confirmPassword ? <div className="form-error">{errors.confirmPassword}</div> : null}
            </Form.Group>
               
              
               
                <Button variant="primary" type="submit">
                   Update Password 
                </Button>
            </Form>
            <br/> */}
          
        </div>
        </>
    )
}
const mapDispatchToProps = {
    logOutUser: logOutUser,
};

const mapStateToProps = (state) => ({
    user: state.userReducer.user,
    isAuthenticated: state.userReducer.isAuthenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);