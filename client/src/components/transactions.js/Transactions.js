import React, { useEffect, useState } from 'react';
import Header from '../common/Header'
import API from '../../api/api';
import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { getWallet1 } from "../../redux/actions/action";
import Sidebar from '../common/Sidebar';
import Swal from 'sweetalert2'
import Footer from '../common/Footer';
import api from '../../api/api';
import jwt_decode from "jwt-decode";
const Wallet = ({
    getOrders,
    history,
    wallet1,
    wallet1Loaded,
    userProfile,
    isAuthenticated
}) =>{
    const [walletData, setWalletData] = useState([]);
    const [balance,setBalance] = useState(0)
    const [products,setProducts] = useState([])
    const [isLoaded,setisLoaded] = useState(false)
    useEffect(()=>{
        if(isAuthenticated && !isLoaded){
           
         var tok = localStorage.getItem("jwtToken");
         const decoded = jwt_decode(tok);
         if(decoded.emailVerified){
             var userInfo={userId:decoded.id}
             getWallet1(userInfo)
             setisLoaded(true)
         }
        }
     },[wallet1Loaded,isAuthenticated])
     useEffect(()=>{
        loadData()
     },[])
     function loadData(){
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
        var userInfo={userId:decoded.id}
       api.getWallet(userInfo).then((response)=>{
           var credit = 0
           var debit = 0
           response.data.result.map((entry,index)=>{
                credit+=entry.credit
                debit+=entry.debit
           })
        var balance = credit - debit
        setBalance(balance)
        setWalletData(response.data)
      
        setisLoaded(true)
       })
       .catch((error)=>{
           console.log(error)
       })
     }
     function addBalance(){
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
                    userId:userProfile.id,
                    amount:result.value
                }
                API.addBalance(user)
                .then((response)=>{
                  loadData()
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
<h3>Wallet Details </h3>
</div>
<hr/>
<div className="page-content">
    <section className="row">
        <div className="col-12 col-lg-12">
            <div className="row">
            <div class="card">
                <h4 style={{textAlign:'center',margin:'10px'}}>Wallet Balance : {isLoaded ? balance : "..."} <button onClick={()=>addBalance()}>Deposit Amount </button></h4>
            <div class="table-responsive">
                <table class="table table-lg">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Description</th>
                            <th>Debit</th>
                            <th>Credit</th>
                         
                        </tr>
                    </thead>
                    <tbody>
                        {
                        isLoaded ? walletData?.result?.map((entry,index)=>(
                            <tr key={index}>
                                 <td className="text-bold-500">{entry._id}</td>
                                 <td>{entry.description}</td>
                                 <td className="text-bold-500">{entry.debit != null ? <span class="badge bg-light-danger">{entry.debit}</span> : " - "}</td>
                                 <td className="text-bold-500">{entry.credit != null ? <span class="badge bg-light-success">{entry.credit}</span> : " - "}</td>
                                
                            
                            
                              
                               
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
    getWallet1: getWallet1,
};
const mapStateToProps = (state) => ({
    wallet1:state.userReducer.wallet1,
    wallet1Loaded:state.userReducer.isWallet1Loaded,
    userProfile:state.userReducer.user,
    isAuthenticated:state.userReducer.isAuthenticated
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
