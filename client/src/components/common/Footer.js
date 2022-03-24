import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { loadWallet } from "../../redux/actions/action";
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2'
function Footer({
    userProfile,
    walletUpdated,
    isAuthenticated
}) {
    useEffect(()=>{
        // alert("LOADING WALLET")
        // loadWallet({userId:"62343eb650765d7a33191ba9"})
        // alert(JSON.stringify(userProfile))
    },[])

  return (
    <div>
         <section>
    <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 style={{textAlign:'center'}}>
                                
                                {userProfile?.type == "customer" ?" Wallet Address :  "+userProfile?.walletAddress : "Admin Account "}
                                
                                </h4>
                           
                        </div>
                       
                    </div>
                </div>
            </div>
    </section>
    </div>
  )
}
const mapDispatchToProps = {
    loadWallet: loadWallet,
  
};
const mapStateToProps = (state) => ({
    isAuthenticated:state.userReducer.isAuthenticated,
    userProfile:state.userReducer.user,
    walletUpdated:state.userReducer.isWalletLoaded,
});

export default connect(mapStateToProps,mapDispatchToProps)(Footer);


