import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from "../../api/api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import BounceLoader from 'react-spinners/DotLoader'
function ForgotPassword({ history }) {
    const [userData, setUserData] = useState({ email: ""});
    const [errors, setErrors] = useState({});
    const [isActive,setIsActive] = useState(false);

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
        const {  email } = userData;
        const errors = {};

    
        if (!email) errors.email = "*Email is required";
    

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }
   
    function handleSave(event) {
       
       
        event.preventDefault();
       
        if (!formIsValid()) return;
        setIsActive(true)
        Swal.fire({
            title: 'Password Reset ! ',
            html: 'Sending Password Reset Link, Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
        API.forgot(userData)
            .then(() => {
                setIsActive(false)
                Swal.fire({
                    title: 'Password Reset  ! ',
                    text: 'Password Reset Link has been Sent to Your Email, Please Check Your Email Inbox !  ' ,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'#007bff'
                  }).then(()=>{
                    setUserData({email: "" });
                    history.push("/login");
                  })
            })
            .catch((err) => {
                setIsActive(false)
                console.log(err.response.data);
                toast.error()
                Swal.fire({
                    title: 'Password Reset ! ',
                    text: err.response.data.message ,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'red'
                  })
            })
        // setSaving(true);
        // saveCourse(course)
        //     .then(() => {
        //         toast.success("Course saved.");
        //         history.push("/courses");
        //     })
        //     .catch(error => {
        //         setSaving(false);
        //         setErrors({ onSave: error.message });
        //     });
    }

    return (
        <div className="register-form">
                    <div id="auth">
        
        <div class="row h-100 justify-content-center">
            <div class="col-lg-5 col-12">
               <div id="auth-left" className=''>
            <h1 class="auth-title">Forgot Password</h1>
            <p class="auth-subtitle mb-5">Input your email and we will send you reset password link.</p>

            <form onSubmit={handleSave}>
                <div class="form-group position-relative has-icon-left mb-4">
                    <input type="email"  onChange={handleChange} value={userData.email} name='email' class="form-control form-control-xl" placeholder="Email" />
                    <div class="form-control-icon">
                        <i class="bi bi-envelope"></i>
                    </div>
                </div>
                {errors.email ? <div className="form-error">{errors.email}</div> : null}
                <button disabled={isActive} type='submit' class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Reset Password </button>
            </form>
            <div class="text-center mt-5 text-lg fs-4">
                <p class='text-gray-600'>Remember your account ? <a onClick={()=> history.push('/login')} class="pointer font-bold">Log in</a>.
                </p>
            </div>
            </div>
              {/* {isActive ?  <div className='loading-spinner'> <img width="90" src="loading.gif"/>  </div>: <div className='loading-spinner'></div>}
            <br/>
            <h3>Forgot Account Password ?  </h3>
            <hr/>
            <Form onSubmit={handleSave}>
                
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Enter Your Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder=""
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                    {errors.email ? <div className="form-error">{errors.email}</div> : null}
                </Form.Group>
               
              
               
                <Button variant="primary" type="submit">
                    Reset Password 
                </Button>
            </Form>
            <br/> */}
                    </div>
                </div>
           </div>
        </div>
    )
}

export default ForgotPassword;
