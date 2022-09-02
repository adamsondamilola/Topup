import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../../constants/urls';

const SideBar = () => {

  const logOut = () =>{
    localStorage.removeItem('loginToken')
    window.location.replace("/");
  }

  const [userData, setUserData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('loginToken'));

  const [website, setWebsite] = useState([]);
  const websiteSettings = () => {        
    fetch(urls.apiurl +'admin/website_settings')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1) {
                var x = json.result;
                setWebsite(x)
                }
        })
        .catch((error) => console.error(error))
        .finally(() => console.log("done"));
}

  const getUserDetails = () => {
    fetch(urls.apiurl +'user/'+ token+'/user_details/')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1) {
                setUserData(json.result)
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
}

const  handleLinkClick = () => {
    this.setState({ isOpen: false });
   };

   useEffect(()=>{
    websiteSettings()
    getUserDetails();
},[])

        return <aside class="main-sidebar">
        <section class="sidebar position-relative">
              <div class="multinav">
              <div class="multinav-scroll" style={{height: "100%"}}>	
                  <ul class="sidebar-menu" data-widget="tree">			
                    <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/dashboard">
                        <i data-feather="monitor"></i>
                        <span>Dashboard</span>
                      </Link>
                    </li>

                     
                    <li style={{display: userData.role != null && userData.role == 'Admin'? `block` : `none` }}>
                      <a href={urls.adminurl}>
                      <i data-feather="monitor"></i>
                        <span>Admin Dashbaord</span>
                      </a>                      
                    </li>

                    <li style={{display: (userData.role != null && userData.role == 'Staff') || (userData.role != null && userData.role == 'Admin')? `block` : `none` }}>
                      <Link  onClick={() => handleLinkClick()} to="/user/manage_airtime">
                      <i data-feather="phone"></i>
                        <span>Manage Airtime</span>
                      </Link>                      
                    </li>

    <li class="treeview">
                      <a href="#">
                        <i data-feather="user"></i>
                        <span>Account</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>
                      <ul class="treeview-menu">											
                      <li>
                            <Link  onClick={() => handleLinkClick()} to="/user/profile">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Profile
                              </Link>
                               </li>												
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/user/update_profile">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Edit Profile
                              </Link>
                               </li>												
                               <li>
                            <Link  onClick={() => handleLinkClick()} to="/user/bank_account">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Bank Account
                              </Link>
                               </li>												
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/user/update_password">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Change Password
                                </Link>
                               </li>												
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/user/update_pin">
                                <i class="icon-Commit"><span class="path1"></span><span class="path1"></span></i>Change PIN
                                </Link>
                               </li>												
						</ul>
                    </li>
                    
                    <li class="treeview">
                      <a href="#">
                        <i data-feather="users"></i>
                        {website.package_type == "affiliate"? <span>Affiliate</span> : <span>Networking</span>}
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>
                      <ul class="treeview-menu">											
                      <li>
                            <Link  onClick={() => handleLinkClick()} to={"/user/referral_link"}>
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Referral Link
                              </Link>
                               </li>												
                               <li>
                            <Link  onClick={() => handleLinkClick()} to="/user/referrals">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Referrals
                              </Link>
                               </li>												
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/user/commission">
                                <i class="icon-Commit"><span class="path1"></span><span class="path1"></span></i>Commission
                              </Link>
                               </li>
                               {website.package_type != "affiliate"? <li>
                               <Link  onClick={() => handleLinkClick()} to="/user/points">
                                <i class="icon-Commit"><span class="path1"></span><span class="path1"></span></i>Points
                              </Link>
                               </li>	
                               : "" }											
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/user/upgrade">
                                <i class="icon-Commit"><span class="path1"></span><span class="path1"></span></i>Upgrade
                              </Link>
                               </li>												
						</ul>
                    </li>

                    <li class="treeview">
                      <a href="#">
                        <i data-feather="credit-card"></i>
                        <span>Wallet</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>					
                      <ul class="treeview-menu">					
                      <li><Link  onClick={() => handleLinkClick()} to="/user/fund_wallet"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Add fund</Link></li>
                      <li><Link  onClick={() => handleLinkClick()} to="/user/wallet"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Balances</Link></li>
                      <li><Link  onClick={() => handleLinkClick()} to="/user/transactions"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Transactions</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/cashback/transactions"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Cashback history</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/load_voucher"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Load voucher for wallet</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/transfer"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Transfer</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/withdraw"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Withdraw</Link></li>
                      </ul>
                    </li>

                    
                    <li class="treeview">
                      <a href="#">
                        <i data-feather="circle"></i>
                        <span>Coupons</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>					
                      <ul class="treeview-menu">					
                        <li><Link  onClick={() => handleLinkClick()} to="/user/package_coupons"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Package Coupons</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/wallet_coupons"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Wallet Coupons</Link></li>
                      </ul>
                    </li>

                    <li class="treeview">
                      <a href="#">
                        <i data-feather="server"></i>
                        <span>Airtime and Data</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>					
                      <ul class="treeview-menu">					
                      <li><Link  onClick={() => handleLinkClick()} to="/user/buy_airtime"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Buy Airtime</Link></li>
                      <li><Link  onClick={() => handleLinkClick()} to="/user/print_airtime"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Print Airtime</Link></li>
                      <li><Link  onClick={() => handleLinkClick()} to="/user/none_sme_data"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Regular Data</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/mtn_special"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>SME Data</Link></li>
                        <li><Link  onClick={() => handleLinkClick()} to="/user/foreign_airtime"><i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Foreign Airtime</Link></li>
                      </ul>
                    </li>

                    <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/transfer">
                        <i data-feather="send"></i>
                        <span>Send Money</span>
                      </Link>
                      </li>
                   	 
                   	 
                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/cable_tv">
                        <i data-feather="tv"></i>
                        <span>Pay Cable TV</span>
                      </Link>
                      </li>                   	 
                   	 
                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/electricity">
                        <i data-feather="zap"></i>
                        <span>Pay Electricity Bill</span>
                      </Link>
                      </li>
                   	 
                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/transactions">
                        <i data-feather="printer"></i>
                        <span>Print Receipt</span>
                      </Link>
                      </li>

                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/api">
                        <i data-feather="link"></i>
                        <span>APIs</span>
                      </Link>
                      </li>

{/*
<li>
                      <Link  onClick={() => handleLinkClick()} to="/user/digital_products">
                        <i data-feather="box"></i>
                        <span>Digital Products</span>
                      </Link>
                      </li>

                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/presentation">
                        <i data-feather="list"></i>
                        <span>topupearn Presentation</span>
                      </Link>
                      </li>
                      */}

                      {/* <li>
                      <Link  onClick={() => handleLinkClick()} to="/user/order_printer">
                        <i data-feather="printer"></i>
                        <span>Order Airtime Printer</span>
                      </Link>
                      </li> */}

                      

                      <li onClick={() => logOut() } class="treeview">
                      <a href="#">
                        <i data-feather="log-out"></i>
                        <span>Logout</span>
                      </a>
                       </li>
                        
                  </ul>
                  
                 
              </div>
            </div>
        </section>
      </aside>;
      }

      export default SideBar