import React, { useEffect, useState } from 'react';
import Header from '../common/Header'
import API from '../../api/api';
import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { getCustomers } from "../../redux/actions/action";
import Sidebar from '../common/Sidebar';
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import Footer from '../common/Footer';

const Customers = ({
    getCustomers,
    history,
    customersData,
    customersFound,
    userProfile,
    isAuthenticated
}) =>{
    const [isLoaded,setisLoaded] = useState(false)
    useEffect(()=>{
       if(isAuthenticated && !isLoaded){
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
        if(decoded.emailVerified){
            var userInfo={adminId:decoded.id}
            getCustomers(userInfo)
            if(customersFound){
                setisLoaded(true)
            }
         }
       }

    },[isAuthenticated,customersFound])

    function addBalance(customer){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Enter Amount ! ',
         
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirm  ',
            cancelButtonText: 'Cancel ',
            reverseButtons: false,
            inputPlaceholder:"Enter Amount to load into Wallet",
            input:"number",
          }).then((result) => {
            
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Processing ! ',
                    html: 'Adding Balance to Wallet  , Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
                var user={
                    currencyId:"6238bf6cf8b52ba80db9ae22",
                    userId:customer._id,
                    amount:result.value
                }
                API.addBalance(user)
                .then((response)=>{
                    getCustomers({userId:user.adminId})
                    swalWithBootstrapButtons.fire(
                        'Success !',
                        'Balance Added to Wallet  Successfully !  ',
                        'success'
                      )
                })
                .catch((err)=>{
                    swalWithBootstrapButtons.fire(
                        'Failed ! ',
                       err.message,
                        'error'
                      )
                })
            } 
          })
    }

    function deleteUser(customer){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Confirm  ? ',
            text: "Are you sure you want to Delete User ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete ',
            cancelButtonText: 'No, Cancel ! ',
            reverseButtons: false
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Processing ! ',
                    html: 'Deleting User , Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
                var user={
                 
                    adminId:userProfile.id,
                    userId:customer._id
                }
                API.deleteUser(user)
                .then((response)=>{
                    getCustomers({adminId:user.adminId})
                    swalWithBootstrapButtons.fire(
                        'Deleted !',
                        'User Deleted Successfully !  ',
                        'success'
                      )
                })
                .catch((err)=>{
                    swalWithBootstrapButtons.fire(
                        'Failed ! ',
                       err.message,
                        'error'
                      )
                })
            } 
          })
    }

    return (<>

    {/* <Header/> */}
    <Sidebar/>
      
    <div id="main">
        <header className="mb-3">
            <a href="#" className="burger-btn d-block d-xl-none">
                <i className="bi bi-justify fs-3"></i>
            </a>
        </header>
<div className="page-heading">
<h3>Customers </h3>
</div>
<hr/>
<div className="page-content">
    <section className="row">
        <div className="col-12 col-lg-12">
            <div className="row">
            <div class="card">
            <div class="table-responsive">
                <table class="table table-lg">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Email Verified</th>
                            <th>Wallet Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        customersFound ? customersData?.customers.map((customer,index)=>(
                            <tr key={index}>
                                <td className="text-bold-500">{customer._id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.emailVerified ? "Yes" : "NO"}</td>
                                <td className="text-bold-500">{customer.walletAddress}</td>
                                <td className="text-bold-500">
                                 <button onClick={()=>deleteUser(customer)} class="btn btn-danger btn-sm"> Delete user</button>
                                {/* <button onClick={()=>addBalance(customer)} class="btn btn-primary btn-sm"> Add Balance </button> -  <button onClick={()=>deleteUser(customer)} class="btn btn-danger btn-sm"> Delete user</button>
                                */}
                                </td>
                            </tr>
                        )):"Loading Data . . . . "
                        }
                        
                    </tbody>
                </table>
             </div>
</div>
            </div>
            
        </div>

    </section>

   
</div>
<Footer/>
           
        </div>
          
       
      
        </>
    )
}
const mapDispatchToProps = {
    getCustomers: getCustomers,
};
const mapStateToProps = (state) => ({
    customersData:state.userReducer.customersData,
    customersFound:state.userReducer.customersFound,
    userProfile:state.userReducer.user,
    isAuthenticated:state.userReducer.isAuthenticated
    
});

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
