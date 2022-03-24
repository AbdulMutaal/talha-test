import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from "../../api/api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import { setCurrentUser } from "../../redux/actions/action"
function ChangePassword({ history }) {
    const [userData, setUserData] = useState({ password: "",confirmPassword:"",userId:""});
    const [errors, setErrors] = useState({});
    const [isActive,setIsActive] = useState(false);
    const [heading,setHeading] = useState("Update Account Password ")
  
    useEffect(()=>{
        //getting jwt token from query params string
        const query = new URLSearchParams(window.location.search);
        const uid = query.get('uid')
        if(uid){
            try{
                if(typeof uid == null || typeof uid ==undefined){
                    throw new Error("Invalid Token")
                }
                const decoded = jwt_decode(uid);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    Swal.fire({
                        title: 'Invalid/Expired  Link ',
                        text: 'This Link is Invalid/Expired, Please reset your password again !' ,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor:'red'
                      }).then(()=>{
                         history.push('/forgot')
                      })
                }
                else{
                  
                    setUserData(prevState => ({
                        ...prevState,
                        userId: decoded.id,
                    }))
                   
                }
            }
            catch(error){
                Swal.fire({
                    title: 'Invalid/Expired  Link ',
                    text: 'This Link is Invalid/Expired, Please reset your password again !' ,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'red'
                  }).then(()=>{
                      history.push('/forgot')
                  })
            }
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
        setIsActive(true)
        event.preventDefault();
       
        if (!formIsValid()) return;
        API.changePassword(userData)
            .then((response) => {
                console.log("Change Password Response",response)
                setIsActive(false)
                Swal.fire({
                    title: 'Change Password! ',
                    text: 'You Password Has Been Updated Successfully, Please Login Again ! ',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'#007bff'
                  }).then(()=>{
                    setUserData({password: "",confirmPassword:"" });
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
              {isActive ?  <div className='loading-spinner'><img width="90" src="loading.gif"/>  </div>: <div className='loading-spinner'></div>}
              <br/>
            <h3>{heading}</h3>
            <hr/>
            <Form onSubmit={handleSave}>
                
            <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
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
            <br/>
          
        </div>
    )
}

export default ChangePassword;
