import React, { useState,useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from "../../api/api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'

function Register({ history }) {

    const [userData, setUserData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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
        const { name, email, password, confirmPassword } = userData;
        const errors = {};

        if (!name) errors.name = "*Name is required.";
        if (!email) errors.email = "*Email is required";
        if (!password) errors.password = "*Password is required";
        if (!confirmPassword) errors.confirmPassword = "*Confirm password is required"

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    function handleSave(event) {
       
        event.preventDefault();
        if (!formIsValid()) return;
        Swal.fire({
            title: 'Creating Account ! ',
            html: 'Please wait while we are setting up your account ...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
        setIsActive(true)
        API.registerUser(userData)
            .then(() => {
                setIsActive(false)
                Swal.fire({
                    title: 'Account Created !',
                    text: 'Please check your email inbox to verify your email address !  ' ,
                    icon: 'success',
                    confirmButtonText: 'Login ',
                    confirmButtonColor:'#007bff'
                  })
                history.push("/login");
                setUserData({ name: "", email: "", password: "", confirmPassword: "" });
            })
            .catch((err) => {
                setIsActive(false)
                console.log(err.response.data);
                if(err.response.data.alreadyExists)
                {
                    Swal.fire({
                        title: 'Failed  ! ',
                        text: "This Email is already associated with another account !" ,
                        icon: 'error',
                        confirmButtonText: 'Login To Account ',
                        confirmButtonColor:'#007bff',
                        denyButtonText:'Use Another Email',
                        showDenyButton:true,
                      }).then((value)=>{
                          console.log(value)
                        if(value.isConfirmed){
                           history.push("/login");
                        }
                        if(value.isDenied){
                            setUserData(prevState => ({
                                ...prevState,
                                email: "",
                            }))
                        }
                      })
                }
                else{
                    Swal.fire({
                        title: 'Failed   ! ',
                        text: err.response.data.message ,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor:'red'
                      })
                }
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
               
                    <h1 class="auth-title">Sign up.</h1>
                    <p class="auth-subtitle mb-5">Create new account !</p>
        
                    <form onSubmit={handleSave}>
                    <div class="form-group position-relative has-icon-left mb-4">
                            <input type="text"  disabled={isActive} value={userData.name} onChange={handleChange} class="form-control form-control-xl" name="name" placeholder="Full Name"/>
                            <div class="form-control-icon">
                                <i class="bi bi-person"></i>
                            </div>
                        </div>
                        {errors.name ? <div className="form-error">{errors.name}</div> : null}
                        <div class="form-group position-relative has-icon-left mb-4">
                            <input type="text"  disabled={isActive} value={userData.email} onChange={handleChange} class="form-control form-control-xl" name="email" placeholder="Email Address"/>
                            <div class="form-control-icon">
                                <i class="bi bi-envelope"></i>
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

                        <div class="form-group position-relative has-icon-left mb-4">
                            <input  disabled={isActive} value={userData.confirmPassword} onChange={handleChange} type="password" class="form-control form-control-xl" name="confirmPassword" placeholder="Confirm Password"/>
                            <div class="form-control-icon">
                                <i class="bi bi-shield-lock"></i>
                            </div>
                        </div>
                        {errors.confirmPassword ? <div className="form-error">{errors.confirmPassword}</div> : null}
                       
                        <button disabled={isActive} type='submit' class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Sign Up</button>
                    </form>
                    <div class="text-center mt-5 text-lg fs-4">
                        <p class="text-gray-600">Already have an account ? <a onClick={()=> history.push("/login")} class="pointer font-bold">Sign
                                in</a></p>
                        <p><a class="font-bold pointer" onClick={()=> history.push("/forgot")} >Forgot password?</a></p>
                    </div>
                    {isActive ?  <center><div className='loading-spinner'> <img width="90" src="loading.gif"/>  </div></center>: <div className='loading-spinner'></div>}
                </div>
            </div>
           
        </div>
        
        </div>
        
             {/* <br/>
            <h3>Create new Account </h3> <hr/>
            <Form onSubmit={handleSave}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        disabled={isActive}
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                    {errors.name ? <div className="form-error">{errors.name}</div> : null}
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Your Email address</Form.Label>
                    <Form.Control
                        type="email"
                        disabled={isActive}
                        placeholder=""
                        name="email"
                        value={userData.email || ""}
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
                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        disabled={isActive}
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword ? <div className="form-error">{errors.confirmPassword}</div> : null}
                </Form.Group>
                
                <Button variant="primary" type="submit">
                    Register
                </Button>
                <Button className='ml-10'  onClick={()=>{history.push('/login')}} variant="default" type="button">
                    Already have an Account ? <i><b>Login</b></i>
                </Button>
            </Form> */}
        </div>
    )
}

export default Register;
