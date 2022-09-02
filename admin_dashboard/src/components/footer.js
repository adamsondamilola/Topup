import React, { Component, useEffect, useState } from 'react';
import {
    Link
  } from "react-router-dom";
import urls from '../constants/urls';
  

  const Footer = () => {

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
   
  
  
      
     
         
          return 	<footer class="footer-area bg-color pt-100 pb-70">
          
          
      </footer>
      
      ;
        }
        export default Footer
  