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
  const getUserDetails = () => {
    fetch(urls.apiurl +'user/'+ token+'/user_details/')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1 && json.result.role == 'Admin') {
                setUserData(json.result)
            }else{
               window.location.replace("/login");
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
}

const  handleLinkClick = () => {
    this.setState({ isOpen: false });
   };

   useEffect(()=>{
    getUserDetails();
},[])

        return <aside class="main-sidebar">
        <section class="sidebar position-relative">
              <div class="multinav">
              <div class="multinav-scroll" style={{height: "100%"}}>	
                  <ul class="sidebar-menu" data-widget="tree">			
                    <li>
                      <Link  onClick={() => handleLinkClick()} to="/admin/stats">
                        <i data-feather="monitor"></i>
                        <span>Dashboard</span>
                      </Link>
                    </li>

                    <li class="treeview">
                      <a href="#">
                        <i data-feather="users"></i>
                        <span>Users</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>
                      <ul class="treeview-menu">											
                      <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/registered_users">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Registered Users
                                </Link>
                               </li>											
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/active_users">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Active Users
                                </Link>
                               </li>											
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/inactive_users">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Inactive Users
                                </Link>
                               </li>												
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
                      <li>
                              <Link  onClick={() => handleLinkClick()} to="/admin/package_coupons">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Package Coupons
                              </Link>
                               </li>												
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/wallet_coupons">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Wallet Coupons
                              </Link>
                               </li>
                      </ul>
                    </li>

                    <li class="treeview">
                      <a href="#">
                        <i data-feather="settings"></i>
                        <span>Agent Commissions</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>					
                      <ul class="treeview-menu">					
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/network_commissions_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>VTU/Data Commissions
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/print_airtime_commissions_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Airtime Print Commissions
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/cable_commission_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Cable Commissions
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/electricitiy_commission_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Electricity Commissions
                              </Link>
                               </li>
                      </ul>
                    </li>

                    <li class="treeview">
                      <a href="#">
                        <i data-feather="settings"></i>
                        <span>Free Accounts Commission </span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>					
                      <ul class="treeview-menu">					
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/free_users_network_commissions_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>VTU/Data Commissions
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/free_users_print_airtime_commissions_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Airtime Print Commissions
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/free_users_cable_commission_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Cable Commissions
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/free_users_electricitiy_commission_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Electricity Commissions
                              </Link>
                               </li>
                      </ul>
                    </li>

                    <li class="treeview">
                      <a href="#">
                        <i data-feather="settings"></i>
                        <span>Other Settings</span>
                        <span class="pull-right-container">
                          <i class="fa fa-angle-right pull-right"></i>
                        </span>
                      </a>					
                      <ul class="treeview-menu">					
                      <li>
                              <Link  onClick={() => handleLinkClick()} to="/admin/website_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Website
                              </Link>
                               </li>												
                               <li>
                              <Link  onClick={() => handleLinkClick()} to="/admin/faq">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>FAQ
                              </Link>
                               </li>
  <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/data_prices_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Data Prices
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/cable_prices_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Cable TV Prices
                              </Link>
                               </li>
                               <li>
                               <Link  onClick={() => handleLinkClick()} to="/admin/electricity_prices_settings">
                                <i class="icon-Commit"><span class="path1"></span><span class="path2"></span></i>Electricity TV Prices
                              </Link>
                               </li>                             
                      </ul>
                    </li>

                  <li>
                  <Link  onClick={() => handleLinkClick()} to="/admin/api_keys">
                        <i data-feather="layers"></i>
                        <span>API Keys</span>
                      </Link>					
                        </li> 

                        <li>
                      <Link  onClick={() => handleLinkClick()} to="/admin/print_airtime_stats">
                        <i data-feather="phone"></i>
                        <span>Airtime Print Stats</span>
                      </Link>
                      </li>
                   	 
                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/admin/manage_airtime">
                        <i data-feather="phone"></i>
                        <span>Manage Airtime Print</span>
                      </Link>
                      </li>
                   	 
                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/admin/admin_accounts">
                        <i data-feather="user"></i>
                        <span>Admin Accounts</span>
                      </Link>
                      </li>
                   	 
                      <li>
                      <Link  onClick={() => handleLinkClick()} to="/admin/chats">
                        <i className='fa fa-send text-white'></i>
                        <span>Chat</span>
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