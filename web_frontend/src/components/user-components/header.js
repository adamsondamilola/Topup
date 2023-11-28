import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chatBot from '../../constants/chatBot';
import urls from '../../constants/urls';

const DashbaordHeader = () => {

  const logOut = () =>{
    localStorage.removeItem('loginToken')
    window.location.replace("/");
  }

  const [token, setToken] = useState(localStorage.getItem('loginToken'));

  
  const [userData, setUserData] = useState([]);
  const getUserDetails = () => {
    if(token !== null){
    fetch(urls.apiurl +'user/'+ token+'/user_details/')
        .then((response) => response.json())
        .then((json) => {
            if (json.status === 1) {
                setUserData(json.result)
            }
        })
        .catch((error) => console.error(error))
        .finally(() => console.log("done"));
      }
}

const[trialTimes, setTrialTimes] = useState(0);

const [tawkToUrl, setTawkToUrl] = useState(null);
const [logoUrl, setLogoUrl] = useState(null);
  const websiteSettings = () => {    
    getUserDetails();
    fetch(urls.apiurl +'admin/website_settings')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1) {
              var x = json.result;
                    setLogoUrl(x.dashboard_logo)
                    setTawkToUrl(x.tawkto_url)
                    document.title = x.title
                    chatBot.TawkToChat(x.tawkto_url) //tawkto
                if(userData.role != null && userData.role != 'Admin' && json.result.maintain == 1){
                  window.location.replace("/maintenance");
                }
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setTrialTimes(trialTimes+1));
}



  useEffect(()=>{
    websiteSettings();
    
  },[])
   
  return <header class="main-header">
        <div class="d-flex align-items-center logo-box justify-content-start">	

            <a href="/" class="logo">
             <div class="logo-lg">
             <span class="light-logo"><img src={logoUrl} alt="logo" /></span>
                  <span class="dark-logo"><img src={logoUrl} alt="logo" /></span>
                     </div>
            </a>	
        </div>  
        <nav class="navbar navbar-static-top">
          <div class="app-menu">
            <ul class="header-megamenu nav">
                <li class="btn-group nav-item">
                    <a href="#" class="waves-effect waves-light nav-link push-btn btn-primary-light" data-toggle="push-menu" role="button">
                        <i data-feather="align-left"></i>
                    </a>
                </li>
                {/* <li class="btn-group d-lg-inline-flex d-none">
                    <div class="app-menu">
                        <div class="search-bx mx-5">
                            <form>
                                <div class="input-group">
                                  <input type="search" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon3" />
                                  <div class="input-group-append">
                                    <button class="btn" type="submit" id="button-addon3"><i data-feather="search"></i></button>
                                  </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </li> */}
            </ul> 
          </div>
            
          <div class="navbar-custom-menu r-side">
            <ul class="nav navbar-nav">	
             <li class="btn-group nav-item d-lg-inline-flex d-none">
                    <a href="#" data-provide="fullscreen" class="waves-effect waves-light nav-link full-screen btn-warning-light" title="Full Screen">
                        <i data-feather="maximize"></i>
                    </a>
                </li>

              <li class="dropdown notifications-menu">
                <a href="#" class="waves-effect waves-light dropdown-toggle btn-info-light" data-bs-toggle="dropdown" title="Notifications">
                  <i data-feather="bell"></i>
                </a>
                <ul class="dropdown-menu animated bounceIn">
    
                  <li>
               <ul class="menu sm-scrol">
                       <li>
                        <a href="#">
                          .....
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="footer">
                      <a href="#">View all</a>
                  </li>
                </ul>
              </li>	
              

              <li class="btn-group nav-item">
                  <Link to="/user/settings" data-toggle="control-sidebar" title="Setting" class="waves-effect full-screen waves-light btn-danger-light">
                      <i data-feather="settings"></i>
                  </Link>
              </li>
              
              <li class="dropdown user user-menu">
                <a href="#" class="waves-effect waves-light dropdown-toggle w-auto l-h-12 bg-transparent no-shadow" data-bs-toggle="dropdown" title="User">
                <i data-feather="user"></i>
                </a>
                <ul class="dropdown-menu animated flipInX">
                  <li class="user-body">
                     <Link class="dropdown-item" to="/user/profile"><i class="ti-user text-muted me-2"></i> Profile</Link>
                     <Link class="dropdown-item" to="/user/update_password"><i class="ti-settings text-muted me-2"></i> Change Password</Link>
                     <div class="dropdown-divider"></div>
                     <a class="dropdown-item" href="#" onClick={() => logOut()}><i class="ti-lock text-muted me-2"></i> Logout</a>
                  </li>
                </ul>
              </li></ul>
          </div>
        </nav>
      </header>;
      
}

export default DashbaordHeader