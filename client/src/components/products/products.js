import React, { useEffect, useState } from 'react';
import Header from '../common/Header'
import API from '../../api/api';
import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { getProducts } from "../../redux/actions/action";
import Sidebar from '../common/Sidebar';
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import Footer from '../common/Footer';
const Product = ({
    getProducts,
    history,
    productsData,
    productFound,
    userProfile
}) =>{
    const [orderData, setOrderData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [products,setProducts] = useState([])
    const [isLoaded,setisLoaded] = useState(false)
    useEffect(()=>{
        getProducts()
    },[])

    function placeOrder(product){
        var tok = localStorage.getItem("jwtToken");
         const decoded = jwt_decode(tok);
        if(decoded.type=="admin"){
            alert("Admin Account be used for purchases ")
            return ""
            
        }
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Confirm Order  ? ',
            text: "Are you sure you want to Place Order  ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confirm Purchase ',
            cancelButtonText: 'No, Cancel ! ',
            reverseButtons: false
          }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    title: 'Processing! ',
                    html: 'Processing Your Order , Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
                  
                 
                var orderData={
                    userId:decoded.id,
                    product:product,
                }
                
            

                API.placeOrder(orderData)
                .then((response)=>{
                   
                    if(response.insuffecientBalance){
                        swalWithBootstrapButtons.fire(
                            'Failed ! ',
                           "Insuffecient Wallet Balance",
                            'error'
                          )
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'Confirmed !',
                            'Order Placed, We have recieved your order ! ',
                            'success'
                          )
                    }
                    
                })
                .catch((err)=>{
                    if(err.message == "Request failed with status code 433"){
                        swalWithBootstrapButtons.fire(
                            'Failed ! ',
                         "Insuffecient Wallet Balance ",
                            'error'
                          )
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'Failed ! ',
                         err.message,
                            'error'
                          )
                    }
                    
                })
            } 
          })
    }
    function viewProduct(product){
        var tok = localStorage.getItem("jwtToken");
        const decoded = jwt_decode(tok);
       
        var status =  product.quantity > 0 ? '<span class="badge bg-success">In Stock</span>' :' <span class="badge bg-danger">Out of Stock</span>'
        var keywords = product.keywords.map((keyword,index)=>{
            return('<span class="badge bg-light-primary">'+keyword+'</span>')
        })
        Swal.fire({
            title: '<strong>Product Details</strong>',
            html:'<div class="row"><div class="col-lg-12">'+
                  ' <img width="250" class="img-fluid" src='+product.image+' alt="Product Image"  /><br/><br/>'+
                 '</div>'+
                  '<div class="col-lg-12">'+
                 
                 '  <table class="table table-bordered mb-0">'+
                 '<tr><td class="text-bold-500"><strong>Product</strong></td><td>'+product.title+'</td></tr>'+
                   '<tr><td class="text-bold-500"><strong>Description</strong></td>'+
                  '   <td>'+product.description+'</td></tr>'+
                '     <tr>'+
                '         <td class="text-bold-500"><strong>Price</strong></td>'+
                '        <td>'+product.currency[0].symbol+' '+product.price+'</td>'+
                '    </tr>'+
                '     <tr>'+
                '         <td class="text-bold-500"><strong>Brand</strong></td>'+
                '        <td>'+product.brand+'</td>'+
                '    </tr>'+      
                
                '     <tr>'+
                '         <td class="text-bold-500"><strong>Keywords</strong></td>'+
                '        <td>'+
                             keywords
                         +'</td>'+
                '    </tr>'+  
                
                '     <tr>'+
                '         <td class="text-bold-500"><strong>Status</strong></td>'+
                '        <td>'+
                             status
                         +'</td>'+
                '    </tr>'+ 
                    
                '  </div>'+
                  '</div>',

            showCloseButton: true,
            width:'40rem',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              'Buy Now',
            confirmButtonAriaLabel: 'Buy Now',
            cancelButtonText:
              'Cancel',
            cancelButtonAriaLabel: 'Cancel'
          }).then((value)=>{
              if(value.isConfirmed){
                  //confirm Order 
                  placeOrder(product)
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
<h3>Buy Products</h3>
</div>
<hr/>
<div className="page-content">
    <section className="row">
        <div className="col-12 col-lg-12">
            <div className="row">

            {productFound ? productsData.data.products.map((product,index) =>
                <div key={index} className="col-6 col-lg-3 col-md-6">
                    <div class="card">
                        <div class="card-content">
                            <img class="card-img-top img-fluid" src={product.image} alt="Card image cap" style={{height: "10rem",contain:'cover'}} />
                            <div class="card-body">
                                <h4 class="card-title">{product.title}</h4>
                                <p class="card-text">
                                {product.description}
                                </p>
                                <p class="card-text">
                                Status : <span class="badge bg-success">In Stock</span>
                                {/* <span class="badge bg-danger">Sold Out</span> */}
                                </p>
                                <div >
                                <h4 style={{float:'left'}} class="card-title">{product.currency[0].symbol} {product.price}</h4>
                                    <button style={{width:'100px',float:'right'}} 
                                    onClick={()=>{viewProduct(product)}}
                                    class="btn btn-sm btn-primary"><b>  <i className="bi bi-cart-check"></i> Buy Now</b></button>
                                </div><br/>
                            </div>
                        </div>
                    </div>
                </div>
             ) :''}

            </div>
            
           
        </div>

    </section>

   
</div>
<Footer/>
           
        </div>
          
        {/* <Container>
            <h2>Products </h2>
            <hr/>
            <Row xs={6} md={3} className="g-2">
                {productFound ? productsData.data.products.map((product,index) =>
          
                <Col key={index}>
                <Card>
                    <Card.Img  width="20" variant="top" src={product.image} />
                    <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                      {product.description}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <Row style={{width:'100%',marginTop:'10px'}}>
                        <Col> <Button style={{float:'left !important'}} variant="primary">Buy Now</Button></Col>
                        <Col> <p style={{fontWeight:'bold',textAlign:'right'}} className='product-price'>{product.currency[0].symbol} {product.price}</p></Col>
                       
                       
                    </Row>
                    </Card.Footer>
                </Card>
                </Col>
            ) :''}
            </Row>
        </Container> */}
      
        </>
    )
}
const mapDispatchToProps = {
    getProducts: getProducts,
};
const mapStateToProps = (state) => ({
    productsData:state.productsReducer.products,
    productFound: state.productsReducer.productsFound,
    userProfile:state.userReducer.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
