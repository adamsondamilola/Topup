import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../../constants/urls';

const TopHeader = () => {

	const [token, setToken] = useState(localStorage.getItem('loginToken'));
	const [navClicked, setNavClicked] = useState(localStorage.getItem('navClicked'));
	const [mobileNav, setMobileNav] = useState(false);
	const [expand, setExpand] = useState(false);
	const [collapse, setCollapse] = useState("navbar-collapse collapse");

	const clickNav = () =>{
		if(expand == true){
			setExpand(false)
			setCollapse("navbar-collapse collapse")
		} 
		else {
			setExpand(true)
			setCollapse("navbar-collapse collapse show")
		}
	}

	const [maintain, setMaintain] = useState(null);
    const [title, setTitle] = useState(null);
    const [subTitle, setSubTitle] = useState(null);
    const [logo, setLogo] = useState(null);
    const [dashboardLogo, setDashboardLogo] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [dashboardLogoUrl, setDashboardLogoUrl] = useState(null);
    const [websitePhone, setWebsitePhone] = useState(null);
    const [url, setUrl] = useState(null);
    const [twitterUsername, setTwitterUsername] = useState(null);
    const [facebookUsername, setFacebookUsername] = useState(null);
    const [whatsapp, setWhatsapp] = useState(null);
    const [rcNumber, setRcNumber] = useState(null);

    const websiteSettings = () => {
        
        fetch(urls.apiurl +'admin/website_settings')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    var x = json.result;
                    setMaintain(x.maintain)
                    setTitle(x.title)
                    setSubTitle(x.sub_title)
                    setLogoUrl(x.logo)
                    setDashboardLogoUrl(x.dashboard_logo)
                    setUrl(x.url)
                    setTwitterUsername(x.twitter_username)
                    setFacebookUsername(x.facebook_username)
                    setWhatsapp(x.whatsapp)
					setWebsitePhone(x.phone)
					setRcNumber(x.business_reg)
				}
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }

	useEffect(()=>{
        websiteSettings()
    },[])
   
	
   
	return (
		<nav class="navbar navbar-expand-lg fixed-top custom-nav sticky">
<div class="container">

<a class="logo navbar-brand" href="/">
<img src={logoUrl} alt="" class="img-fluid logo-light" />
<img src={logoUrl} alt="" class="img-fluid logo-dark" />
</a>
<button onClick={()=>clickNav()} class="navbar-toggler" 
type="button" data-toggle="collapse" 
data-target="#navbarCollapse" 
aria-controls="navbarCollapse" 
aria-expanded={expand} 
aria-label="Toggle navigation">
<i class="mdi mdi-menu"></i>
</button>
<div class={collapse} id="navbarCollapse">
<ul onClick={()=>clickNav()} class="navbar-nav ml-auto navbar-center" id="mySidenav">

<li class="nav-item">
									<Link to="/#" class="nav-link active">
										Home 
									</Link>
								</li>
								<li class="nav-item">
								<a href="/#about" class="nav-link">About</a>
								</li>
								<li class="nav-item">
									<a href="/#services" class="nav-link">Services</a>
								</li>
								<li class="nav-item">
								<a href="/#faq" class="nav-link">FAQ</a>
								</li>
								<li class="nav-item">
									<Link to="/register" class="nav-link">Register</Link>
								</li>
								{token === null ? 
								<>
								<li class="nav-item">
									<Link to="/login" class="nav-link">Login</Link>
								</li>
								</>
								:
								<li class="nav-item">
										<a href="/user/dashboard" class="nav-link">Dashbaord</a>
									</li>
									
								}

</ul>
</div>
</div>
</nav>

)
      }
	  
	  export default TopHeader
