import React, { useState,useEffect } from 'react';
import API from "../../api/api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
function VerifyEmail({ history }) {

    const [isActive,setIsActive] = useState(true);
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
                 API.verifyEmail({userId:decoded.id}).then(()=>{
                    setIsActive(false)
                    Swal.fire({
                        title: 'Email Verified !',
                        text: 'Email Verified Successfully, Login to Continue ! ',
                        icon: 'success',
                        confirmButtonText: 'Login',
                        confirmButtonColor:'#007bff'
                      }).then(()=>{
                          history.push('/login')
                      })
                 })
                 .catch((error)=>{
                    Swal.fire({
                        title: 'Verification Failed !',
                        text: error.message ,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor:'red'
                      }).then(()=>{
                          history.push('/login')
                      })
                 })
            }
            catch(error){
                Swal.fire({
                    title: 'Verification Failed ! ',
                    text: 'Verification Link is Invalid/Expired !' ,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'red'
                  }).then(()=>{
                      history.push('/login')
                  })
            }
        }
    },[])
    return (
        <div className="register-form">
              {isActive ?  <div className='loading-spinner'> <img width="90" src="loading.gif"/>  </div>: <div className='loading-spinner'></div>}
            <br/>
            <h3><center>Verifying Email . . . . </center></h3>
            <hr/>
            <br/>
        </div>
    )
}

export default VerifyEmail;
