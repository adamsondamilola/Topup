import React, { Component, useEffect, useState } from 'react';
import {
    Link
  } from "react-router-dom";
import tawkToChat from '../constants/chatBot';
import urls from '../constants/urls';
  
  const Footer = () => {

  const [maintain, setMaintain] = useState(null);
  const [title, setTitle] = useState(null);
  const [subTitle, setSubTitle] = useState(null);
  const [email, setEmail] = useState(null);
  const [dashboardLogo, setDashboardLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [tawkToUrl, setTawkToUrl] = useState(null);
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
                  setTawkToUrl(x.tawkto_url)
                  setUrl(x.url)
                  setTwitterUsername(x.twitter_username)
                  setFacebookUsername(x.facebook_username)
                  setWhatsapp(x.whatsapp)
                  setWebsitePhone(x.phone)
                  setEmail(x.email)
                  setOfficeAddress(x.office_address)
                  tawkToChat.TawkToChat(x.tawkto_url) //tawkto
                  document.title = x.title
              }
          })
          .catch((error) => console.error(error))
          .finally(() => console.log("done"));
  }

  useEffect(()=>{
      websiteSettings()
     // if(tawkToUrl != null) tawkToChat.TawkToChat(tawkToUrl)
    },[])
 


    
   
       
        return 	<footer class="footer-area bg-color pt-100 pb-70">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-6">
                    <div class="single-footer-widget">
                        <a href="/" class="logo">
                            <img src={logoUrl} alt="Image" />
                        </a>

                        <p>{title} is a technology solution company that is leveraging on 
opportunities in local & global telecom sectors & digital economy. 
</p>

                        <ul class="social-icon">
                            <li>
                                <a href={"https://www.facebook.com/"+facebookUsername} target="_blank">
                                    <i class="ri-facebook-fill"></i>
                                </a>
                            </li>
                            <li>
                                <a href={"https://wa.me/"+whatsapp} target="_blank">
                                    <i class="ri-whatsapp-line"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="single-footer-widget">
                        <h3>Useful link</h3>

                        <ul class="import-link">
                            
                            <li>
                                <a href="/login">Sign In</a>
                            </li>
                            <li>
                                <a href="/register">Sign Up</a>
                            </li>
                            <li>
                                <a href="/faq">FAQ</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="single-footer-widget">
                        <h3>Contact Us</h3>

                        <ul class="address">
                            <li class="location">
                                <i class="ri-map-pin-line"></i>
                                {officeAddress}
                            </li>
                            <li>
                                <i class="ri-mail-line"></i>
                                <a href={"mailto:"+email}><span class="__cf_email__" data-cfemail="">{email}</span></a>
                            </li>
                            <li>
                                <i class="ri-phone-line"></i>
                                <a href={"tel:+"+websitePhone}>{websitePhone}</a>
                            </li>
                            <li class="location">
                                <i class="ri-time-line"></i>
                                Mon – Friday: 9:00am – 6:00pm
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="single-footer-widget">
                        <h3>Download App</h3>
                        <p>Coming Soon!</p>

                        <div class="row m-2">
             <div class="btn btn-primary">
             <i className='ri-google-play-fill'></i> Google Play
			 </div>
             <br/>
                </div>
                <div class="row">&nbsp;</div>
                <div class="row m-2">
             <div class="btn btn-secondary">
             <i className='ri-apple-fill'></i> Apple Store
			 </div>
                </div>
                </div>

                </div>

               
            </div>
        </div>
    </footer>
    
    ;
      }
      export default Footer
