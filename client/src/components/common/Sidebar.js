import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { logOutUser,loadWallet } from "../../redux/actions/action";
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
function Sidebar ({
    logOutUser,
    isAuthenticated,
    history,
    loadWallet,
    userProfile
}) {
    const [type,setType] = useState("customer")

    useEffect(()=>{
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
        if(decoded.type=="admin"){
            setType("admin")
        }
    },[])
    
    function handleClick (e) {
        e.preventDefault()
        Swal.fire({
            title: 'Confirm Logout ! ',
            text: "Are you sure you want to log out ? " ,
            icon: 'info',
            confirmButtonText: 'Yes, Logout ',
            confirmButtonColor:'#435ebe',
            denyButtonText:'No, Cancel',
            showDenyButton:true,
          }).then((value)=>{
            if(value.isConfirmed){
                logOutUser();
            }
          })
       
    }
  return (
    <div>
         <div id="sidebar" className="active">
            <div className="sidebar-wrapper active">
    <div className="sidebar-header">
        <div className="d-flex justify-content-between">
            <div className="logo">
                <a style={{textAlign:'center'}} > 
                    Dashboard
                </a>
            </div>
            <div className="toggler">
                <a href="#" className="sidebar-hide d-xl-none d-block"><i className="bi bi-x bi-middle"></i></a>
            </div>
        </div>
    </div>
    <div className="sidebar-menu">
        <ul className="menu">
         
       
            <NavLink to="/products">
            <li
                className={`sidebar-item ${window.location.href.includes("products") ? "active" : "" }`}>
               
                <a className='sidebar-link'>
                    <i className="bi bi-cart4"></i>
                    <span>Buy Products</span>
                </a>
               
               
            </li>
            </NavLink>
            <NavLink to="/orders">
            <li
                 className={`sidebar-item  ${window.location.href.includes("orders") ? "active" : "" }`}>
                
                <a className='sidebar-link'>
                    <i className="bi bi-menu-button-wide"></i>
                    <span>Orders</span>
                </a>
               
               
            </li>
            </NavLink>
            <NavLink to="/wallet">
            <li
                 className={`sidebar-item  ${window.location.href.includes("wallet") ? "active" : "" }`}>
                <a className='sidebar-link'>
                    <i className="bi bi-grid-1x2-fill"></i>
                    <span>Wallet</span>
                </a>
                
            </li>
            </NavLink>
{type == "admin" ? <NavLink to="/customers">
            <li
                 className={`sidebar-item  ${window.location.href.includes("customers") ? "active" : "" }`}>
                <a className='sidebar-link'>
                    <i className="bi bi-person"></i>
                    <span>Customers</span>
                </a>
                
            </li>
            </NavLink>:"" }
           
           <hr/>
          


            <NavLink to="/changePassword">
            <li
                 className={`sidebar-item  ${window.location.href.includes("changePass") ? "active" : "" }`}>
                <a  className='sidebar-link'>
                    <i className="bi bi-puzzle"></i>
                    <span>Change Password</span>
                </a>
            </li>
            </NavLink>

            <NavLink to="/transactions">
            <li
                 className={`sidebar-item `}>
                <a onClick={handleClick} style={{cursor:"pointer"}} className='sidebar-link'>
                    <i className="bi bi-power"></i>
                    <span>Logout</span>
                </a>
            </li>
            </NavLink>
        </ul>
    </div>
    <button className="sidebar-toggler btn x"><i data-feather="x"></i></button>
</div>
        </div>
    </div>
  )
}
const mapDispatchToProps = {
    logOutUser: logOutUser,
  
};

const mapStateToProps = (state) => ({
    user: state.userReducer.user,
    isAuthenticated: state.userReducer.isAuthenticated,
    userProfile:state.userReducer.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);