import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import urls from '../constants/urls';

const TopHeader = () => {

	const [token, setToken] = useState(localStorage.getItem('loginToken'));

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
									<a href="tel:+2349124812588">
										<i class="ri-phone-fill"></i>
										Hotline: {websitePhone}
									</a>
								</li>
							</ul>
						</div>

						<div class="col-lg-6 col-md-6">
							<div class="header-right-content">
							<div class="my-account">
									<b>{rcNumber}</b>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
            <div class="navbar-area">
                <div class="mobile-responsive-nav">
                    <div class="container">
                       <div class="mobile-responsive-menu">
                            <div class="logo">
                                <a href="/">
									<img src={logoUrl} alt="logo" />
								</a>
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
                              
								
								
                            </div>
                        </nav>
                    </div>
				</div>
            </div>
		</header>
        )
      }
	  
	  export default TopHeader
