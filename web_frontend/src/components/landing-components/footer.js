import React, { Component, useEffect, useState } from 'react';
import {
    Link
  } from "react-router-dom";
import tawkToChat from '../../constants/chatBot';
import logos from '../../constants/logos';
import urls from '../../constants/urls';
  
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
 


    
   
       
        return  <footer class="pt-5 pb-5 footer_detail">
        <div class="container">
        <div class="row">
        <div class="col-lg-3">
        <div class="mt-3">
        <img src={logoUrl} width={100} height={30} alt="Logo" />
        <div class="footer_title_border"></div>
        <ul class="list-unstyled footer_menu_list mb-0 mt-4">
                        <li>
                            <Link to="/privacy-policy">Privacy policy</Link>
                        </li>
                        <li>
                            <Link to="/terms-conditions">Terms conditions</Link>
                        </li>
                    </ul>
        </div>
        </div>
        <div class="col-lg-2">
        <h6 class="mt-3 text-white font-weight-normal">Our Pages</h6>
        <div class="footer_title_border"></div>
        <ul class="list-unstyled footer_menu_list mb-0 mt-4">
        <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="/login">Sign In</a>
                            </li>
                            <li>
                                <a href="/register">Sign Up</a>
                            </li>
                            <li>
                                <a href="/#faq">FAQ</a>
                            </li>
        </ul>
        </div>
        <div class="col-lg-2">
        <h6 class="mt-3 text-white font-weight-normal">Download App</h6>
        <div class="footer_title_border"></div>
        <ul class="list-unstyled footer_menu_list mb-0 mt-4">
        <li><a href="#">iOS</a></li>
         <li><a href="#">Android</a></li>
        </ul>
        </div>
        <div class="col-lg-2">
        <h6 class="mt-3 text-white font-weight-normal">Contact Us</h6>
        <div class="footer_title_border"></div>
        <ul class="list-unstyled footer_menu_list mb-0 mt-4 text-muted">
        <li>
                                {officeAddress}
                            </li>
                            <li>
                                <a href={"mailto:"+email}><span class="__cf_email__" data-cfemail="">{email}</span></a>
                            </li>
                            <li>
                                <a href={"tel:+"+websitePhone}>{websitePhone}</a>
                            </li>
                            <li>
                                Mon – Friday: 9:00am – 6:00pm
                            </li>
        </ul>
        </div>
        <div class="col-lg-3">
        <h6 class="mt-3 text-white font-weight-normal">About Us</h6>
        <div class="footer_title_border"></div>
        <div class="mt-4">
        <p class="mb-0">{title} is a technology solution company that is leveraging on 
opportunities in local & global telecom sectors & digital economy.</p>
        <ul class="list-inline fot_social mt-4">
        <li class="list-inline-item"><a href={"https://www.facebook.com/"+facebookUsername} target="_blank" class="social-icon"><i class="mdi mdi-facebook"></i></a></li>
        <li class="list-inline-item"><a href={"https://wa.me/"+whatsapp} target="_blank" class="social-icon"><i class="mdi mdi-whatsapp"></i></a></li>
        </ul>
        </div>
        </div>
        </div>
        <div class="row mt-5">
        <div class="col-lg-12">
        <div class="text-center">
        <p class="copy-rights mb-0">&copy; Copyright <i class="ri-copyright-line"></i> 2022 {title}</p>
        </div>
        </div>
        </div>
        </div>

        <div style={{width: `500px`, position: `relative`, backgroundColor: `orange`, margin: `0 auto`, zIndex: 1000}}>
            <div style={{position: `fixed`, left: 15, bottom: 15}}> <a href='https://wa.me/message/W3Z7BHLWERGJF1' target={'_blank'}> <img src={logos.whatsapp} style={{width: `70px`, height: `70px`}} /> </a></div>
            </div>
        </footer>
       
      }
      export default Footer
