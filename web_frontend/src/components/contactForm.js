import React, { Component, useEffect, useState } from 'react';
import urls from '../constants/urls';

const ContactForm = () => {
	const [maintain, setMaintain] = useState(null);
	const [title, setTitle] = useState(null);
	const [subTitle, setSubTitle] = useState(null);
	const [email, setEmail] = useState(null);
	const [dashboardLogo, setDashboardLogo] = useState(null);
	const [logoUrl, setLogoUrl] = useState(null);
	const [dashboardLogoUrl, setDashboardLogoUrl] = useState(null);
	const [websitePhone, setWebsitePhone] = useState(null);
	const [url, setUrl] = useState(null);
	const [twitterUsername, setTwitterUsername] = useState(null);
	const [facebookUsername, setFacebookUsername] = useState(null);
	const [whatsapp, setWhatsapp] = useState(null);
	const [officeAddress, setOfficeAddress] = useState(null);
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
					setEmail(x.email)
					setOfficeAddress(x.office_address)
				}
			})
			.catch((error) => console.error(error))
			.finally(() => console.log("done"));
	}
  
	useEffect(()=>{
		websiteSettings()
	},[])
	  
        return (<section class="main-contact-area ptb-100">
			<div class="container">
				<div class="row">
					<div class="col-lg-8">
						<div class="contact-form">
							<h2>Drop us a line</h2>
							<form id="contactForm" novalidate="true">
								<div class="row">
									<div class="col-lg-6 col-sm-6">
										<div class="form-group">
											<input type="text" name="name" id="name" class="form-control" required="" data-error="Please enter your name" placeholder="Name" />
											<div class="help-block with-errors"></div>
										</div>
									</div>
		
									<div class="col-lg-6 col-sm-6">
										<div class="form-group">
											<input type="email" name="email" id="email" class="form-control" required="" data-error="Please enter your email" placeholder="Email Address" />
											<div class="help-block with-errors"></div>
										</div>
									</div>

									<div class="col-lg-6 col-sm-6">
										<div class="form-group">
											<input type="text" name="phone_number" id="phone_number" required="" data-error="Please enter your number" class="form-control" placeholder="Your Phone" />
											<div class="help-block with-errors"></div>
										</div>
									</div>
		
									<div class="col-lg-6 col-sm-6">
										<div class="form-group">
											<input type="text" name="msg_subject" id="msg_subject" class="form-control" required="" data-error="Please enter your subject" placeholder="Subject" />
											<div class="help-block with-errors"></div>
										</div>
									</div>
		
									<div class="col-12">
										<div class="form-group">
											<textarea name="message" class="form-control" id="message" cols="30" rows="6" required="" data-error="Write your message" placeholder="Message"></textarea>
											<div class="help-block with-errors"></div>
										</div>
									</div>
		
									<div class="col-lg-12 col-md-12">
										<button type="submit" class="default-btn disabled">
											<span>Send message</span>
										</button>
										<div id="msgSubmit" class="h3 text-center hidden"></div>
										<div class="clearfix"></div>
									</div>
								</div>
							</form>
						</div>
					</div>

					<div class="col-lg-4">
						<div class="contact-info">
							<span class="top-title">Contact details</span>
							<h2>Get in touch</h2>

							<ul class="address">
								<li class="location">
									<span>Address</span>
									{officeAddress}
								</li>
								<li>
									<span>Phone</span>
                                    <a href={"tel:"+websitePhone}>{websitePhone}</a>
								</li>
								<li>
									<span>Email</span>
                                    <a href={"mailto:"+email}>{email}</a>
								</li>
								<li class="location">
									<span>Hours of operation</span>
									Mon – Friday: 9:00am – 6:00pm
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>)
        
    }

	export default ContactForm