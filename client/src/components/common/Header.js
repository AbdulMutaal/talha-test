import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { logOutUser } from "../../redux/actions/action";
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2'
function Header  ({
    logOutUser,
    isAuthenticated,
    history
})  {
    const activeStyle = { color: "white",fontWeight:'bold' };

    useEffect(() => {
    }, [isAuthenticated]);

    function handleClick (e) {
        e.preventDefault()
        Swal.fire({
            title: 'Confirm Logout ! ',
            text: "Are you sure you want to log out ? " ,
            icon: 'info',
            confirmButtonText: 'Yes, Logout ',
            confirmButtonColor:'#007bff',
            denyButtonText:'No, Cancel',
            showDenyButton:true,
          }).then((value)=>{
            if(value.isConfirmed){
                logOutUser();
            }
          })
       
    }

    return (
        <Navbar style={{color:'white'}} variant="dark" bg="dark"  expand="sm">
            <NavLink to="/" activeStyle={activeStyle} exact className="navbar-brand">Home</NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {(isAuthenticated) ? (
                    <Nav className="mr-auto navbar-right-section">
                         <NavLink to="/products" activeStyle={activeStyle} className="nav-link">Products</NavLink>
                        <NavLink to="/wallet" activeStyle={activeStyle} className="nav-link">Wallet</NavLink>
                        <NavLink to="/changePassword" activeStyle={activeStyle} className="nav-link">Change Password </NavLink>
                        <a  className="nav-link pointer" onClick={(e)=>handleClick(e)}>Logout</a>
                    </Nav>
                ) : (
                        <Nav className="mr-auto navbar-right-section">
                            <NavLink to="/register" activeStyle={activeStyle} className="nav-link">Register</NavLink>
                            <NavLink to="/login" activeStyle={activeStyle} className="nav-link">Login</NavLink>
                        </Nav>
                    )}
            </Navbar.Collapse>
        </Navbar>
    );
};

const mapDispatchToProps = {
    logOutUser: logOutUser,
};

const mapStateToProps = (state) => ({
    user: state.userReducer.user,
    isAuthenticated: state.userReducer.isAuthenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
