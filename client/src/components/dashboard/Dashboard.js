import React from 'react'
import Sidebar from '../common/Sidebar'
function Dashboard() {
  return (
    <div id="app">
        <Sidebar/>
        
        <div id="main">
        <header className="mb-3">
            <a href="#" className="burger-btn d-block d-xl-none">
                <i className="bi bi-justify fs-3"></i>
            </a>
        </header>
<div className="page-heading">
<h3>Dashboard</h3>
</div>
<div className="page-content">
    <section className="row">
        <div className="col-12 col-lg-12">
            <div className="row">
                <div className="col-6 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body px-3 py-4-5">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="stats-icon purple">
                                        <i className="iconly-boldShow"></i>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <h6 className="text-muted font-semibold">Wallet Balance</h6>
                                    <h6 className="font-extrabold mb-0">112</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body px-3 py-4-5">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="stats-icon blue">
                                        <i className="iconly-boldProfile"></i>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <h6 className="text-muted font-semibold">Orders</h6>
                                    <h6 className="font-extrabold mb-0">4</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body px-3 py-4-5">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="stats-icon green">
                                        <i className="iconly-boldAdd-User"></i>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <h6 className="text-muted font-semibold">Transactions</h6>
                                    <h6 className="font-extrabold mb-0">5</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
           
          
        </div>
       
    </section>
</div>

           
        </div>
    </div>
  )
}

export default Dashboard