import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../../constants/urls';

const About = () => {
	
	const [maintain, setMaintain] = useState(null);
    const [title, setTitle] = useState(null);
    const [subTitle, setSubTitle] = useState(null);
    const [logo, setLogo] = useState(null);
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

	        return <section class="section bg-light" id="about">
			<div class="container">
			<div class="row">
			<div class="col-lg-12">
			<div class="text-center section_title">
			<p class="sec_small_title text-custom font-weight-bold mb-1">We Are About</p>
			<h3 class="font-weight-bold mb-0">Welcome To {title}</h3>
			<div class="section_title_border">
			<div class="f-border"></div>
			<div class="f-border"></div>
			<div class="s-border"></div>
			<div class="f-border"></div>
			<div class="f-border"></div>
			</div>
			<p class="text-muted sec_subtitle mx-auto mt-2">We are Value Added Services (VAS) organization own by Remo Times Global Concept. We offer instant recharge of Airtime, Data Bundle, CableTV (DStv, GOtv & Startimes), Electricity Bill Payment, Recharge Card Printing and so much more.</p>
			</div>
			</div>
			</div>
			
			
			<div class="row mt-3">
			<div class="col-lg-4">
			<div class="about_boxes bg-white mt-3 text-center rounded">
			<div class="about_icon">
			<i class="mdi mdi-asterisk"></i>
			</div>
			<div class="about_content mt-4">
			<h5 class="font-weight-bold mb-0">Refer & Earn</h5>
			<p class="text-muted mb-0 mt-3">Invite a friend to sign up and earn instant bonus on package sign-up fee. Please, see our frequently asked question for more details.</p>
			<div class="mt-3 about_btn">
			</div>
			</div>
			</div>
			</div>
			<div class="col-lg-4">
			<div class="about_boxes bg-white mt-3 text-center rounded">
			<div class="about_icon">
			<i class="mdi mdi-apple-keyboard-command"></i>
			</div>
			<div class="about_content mt-4">
			<h5 class="font-weight-bold mb-0">Mission</h5>
			<p class="text-muted mb-0 mt-3">To make Topup services easily accessible and create job opportunities for people of all ages irrespective location with small capital.</p>
			<div class="mt-3 about_btn">
			</div>
			</div>
			</div>
			</div>
			<div class="col-lg-4">
			<div class="about_boxes bg-white mt-3 text-center rounded">
			<div class="about_icon">
			<i class="mdi mdi-biohazard"></i>
			</div>
			<div class="about_content mt-4">
			<h5 class="font-weight-bold mb-0">Amazing Discount</h5>
			<p class="text-muted mb-0 mt-3">Get amazing discount after every successful transactions. CashBack Value will be sent to your CashBack wallet, and its withdrawable at any time.</p>
			<div class="mt-3 about_btn">
			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
			</section>

    
}
export default About;