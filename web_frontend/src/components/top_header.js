import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../constants/urls';

const TopHeader = () => {

	const [token, setToken] = useState(localStorage.getItem('loginToken'));
	const [navClicked, setNavClicked] = useState(localStorage.getItem('navClicked'));
	const [mobileNav, setMobileNav] = useState(false);

	const clickMobileNav = () =>{
		if(mobileNav) setMobileNav(false)
		else setMobileNav(true)
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

            <header class="header-area header-area-style-three">

			<div class="top-header">
				<div class="container">
					<div class="row align-items-center">
						<div class="col-lg-6 col-md-6">
							<ul class="header-left-content">
								<li>
									<a className="text-white" href="tel:+2349124812588">
										<i class="ri-phone-fill"></i>
										Hotline:+{websitePhone}
									</a>
								</li>
							</ul>
						</div>

						<div class="col-lg-6 col-md-6">
							<div class="header-right-content">
							<div class="my-account text-white">
									<b>{rcNumber}</b>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/*******************/}
			<div class="navbar-area">
                <div class="mobile-responsive-nav">
                    <div class="container">
                        <div class="mobile-responsive-menu mean-container">
						<div class="mean-bar">
							<a onClick={()=>clickMobileNav()} href="#nav" class={mobileNav? `meanmenu-reveal meanclose` : `meanmenu-reveal`} style={{right:0}}><span><span><span></span></span></span></a><nav class="mean-nav">
                                <ul class="navbar-nav m-auto" style={{display: mobileNav? `block` : `none`}}>
								<li class="nav-item">
										<Link onClick={() => clickMobileNav()} to="/" class="nav-link">
											Home 
											<i class="ri-arrow-down-s-line"></i>
										</Link>
										</li>

										<li class="nav-item">
									<Link onClick={() => clickMobileNav()} to="/faq" class="nav-link">FAQ</Link>
								</li>
								{/*<li class="nav-item">
									<Link onClick={() => clickMobileNav()} to="/packages" class="nav-link">Packages</Link>
								</li>
								<li class="nav-item">
									<Link onClick={() => clickMobileNav()} to="/incentives" class="nav-link">Incentives</Link>
								</li>*/}
								<li class="nav-item">
									<Link onClick={() => clickMobileNav()} to="/contact" class="nav-link">Contact</Link>
								</li>


{/* 
								    <li class="nav-item">
										<a href="#" class="nav-link">
											Blog 
											<i class="ri-arrow-down-s-line"></i>
										</a>

                                        <ul class="dropdown-menu" style={{display: `none`}}>
                                            <li class="nav-item">
												<a href="blog.html" class="nav-link">Blog</a>
											</li>
                                            <li class="nav-item">
												<a href="blog-details.html" class="nav-link">Blog details</a>
											</li>
                                        </ul>
                                    <a class="mean-expand" href="#" style={{fontSize: `18px`}}>+</a>
									</li> */}

                                </ul>

                                
                            </nav></div>

                            <div class="logo">
                                <a href="/">
									<img src={logoUrl} alt="logo" />
								</a>
                            </div>

							<div class="others-options-for-mobile-devices">
								<ul>
								{token === null ? 
								<ul>	
									<li>
										<Link to='/register'>Register</Link>
									</li>
									<li>
										<Link to='/login'>Login</Link>
									</li>
									</ul>
									: 
									<ul>
									<li>
										<a href='/user/dashboard'>Dashbaord</a>
									</li>

									</ul>
									}
								</ul>
							</div>
                        </div>
                    </div>
                </div>

				<div class="desktop-nav">
                    <div class="container">
                        <nav class="navbar navbar-expand-md navbar-light">
                            <a class="navbar-brand" href="/">
							<img src={logoUrl} alt="logo" />
                            </a>

                            <div class="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
                                
							{token === null ? 
								<ul class="navbar-nav m-auto">
								<li class="nav-item">
									<Link to="/" class="nav-link active">
										Home 
									</Link>
								</li>
								<li class="nav-item">
									<Link to="/faq" class="nav-link">FAQ</Link>
								</li>
								{/* <li class="nav-item">
									<Link to="/packages" class="nav-link">Packages</Link>
								</li>
								 <li class="nav-item">
									<Link to="/incentives" class="nav-link">Incentives</Link>
								</li> */}
								<li class="nav-item">
									<Link to="/register" class="nav-link">Register</Link>
								</li>
								<li class="nav-item">
									<Link to="/login" class="nav-link">Login</Link>
								</li>
								<li class="nav-item">
									<Link to="/contact" class="nav-link">Contact</Link>
								</li>
							</ul>

									: 
									
									<ul class="navbar-nav m-auto">
									<li class="nav-item">
										<Link to="/" class="nav-link active">
											Home 
										</Link>
									</li>
                                    <li class="nav-item">
										<Link to="/faq" class="nav-link">FAQ</Link>
									</li>
                                   {/* <li class="nav-item">
									<Link to="/packages" class="nav-link">Packages</Link>
								</li>
								 <li class="nav-item">
									<Link to="/incentives" class="nav-link">Incentives</Link>
								</li> */}
								<li class="nav-item">
										<a href="/user/dashboard" class="nav-link">Dashbaord</a>
									</li>
                                    <li class="nav-item">
										<Link to="/contact" class="nav-link">Contact</Link>
									</li>
                                </ul>

									}
                            </div>
                        </nav>
                    </div>
				</div>

            </div>
			{/*******************/}

</header>
        )
      }
	  
	  export default TopHeader
