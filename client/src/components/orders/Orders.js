import React, { useEffect, useState } from 'react';
import Header from '../common/Header'
import API from '../../api/api';
import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { getOrders } from "../../redux/actions/action";
import Sidebar from '../common/Sidebar';
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import Footer from '../common/Footer';
const Orders = ({
    getOrders,
    history,
    ordersData,
    ordersFound,
    userProfile,
    isAuthenticated
}) =>{
    const [orderData, setOrderData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [products,setProducts] = useState([])
    const [isLoaded,setisLoaded] = useState(false)
    useEffect(()=>{
       if(isAuthenticated && !isLoaded){
          
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
        if(decoded.emailVerified){
            var userInfo={userId:decoded.id}
            getOrders(userInfo)
            setisLoaded(true)
        }
       }

    },[isAuthenticated])

    function refundOrder(order){
        var tok = localStorage.getItem("jwtToken");
         const decoded = jwt_decode(tok);
       
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Confirm Refund  ? ',
            text: "Are you sure you want to Refund Order  ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confirm  ',
            cancelButtonText: 'No, Cancel ! ',
            reverseButtons: false
          }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    title: 'Processing! ',
                    html: 'Processing  , Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
                  
                var orderData={
                    adminId:decoded.id,
                    orderId:order._id,
                }
                API.refundOrder(orderData)
                .then((response)=>{
                    var userInfo={userId:decoded.id}
                    getOrders(userInfo)
                    swalWithBootstrapButtons.fire(
                        'Order Refunded',
                        'Order Refunded, Amount credited to user Wallet ',
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
<h3>My Orders </h3>
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
                            <th>Order ID</th>
                            <th>Product Name</th>
                            <th>Amount</th>
                            <th>Order Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        ordersFound ? ordersData?.data?.orders.map((ord,index)=>(
                            <tr key={index}>
                                <td className="text-bold-500">{ord?._id}</td>
                                <td>{ord?.productDetails[0]?.title}</td>
                                {/* <td className="text-bold-500">{JSON.stringify(ord?.amount).replace(/\D/g,'')}</td> */}
                                <td>{ord?.productDetails[0]?.price}</td>
                                <td className="text-bold-500">{ord?.status}</td>
                                <td className="text-bold-500">{ord?.status != "REFUNDED" && userProfile.type == "admin" ? <button onClick={()=> refundOrder(ord)} className='btn btn-primary btn-sm'>Refund</button> : " - "}</td>
                            </tr>
                        )):"Loading Orders . . . . "
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
    getOrders: getOrders,
};
const mapStateToProps = (state) => ({
    ordersData:state.ordersReducer.orders,
    ordersFound:state.ordersReducer.ordersFound,
    userProfile:state.userReducer.user,
    isAuthenticated:state.userReducer.isAuthenticated
    
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
