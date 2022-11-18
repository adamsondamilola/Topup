import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const PrinterRequest = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);

    const [maintain, setMaintain] = useState(null);
    const [title, setTitle] = useState("null");
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
                    setWhatsapp(x.whatsapp)
                    setWebsitePhone(x.phone)
                    setEmail(x.email)
                    document.title = x.title
                }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }
  
    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setWallet(json.result.wallet)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        websiteSettings()
        getUserDetails();
        if(token == null){
            window.location.replace("/login");
        }
   
    },[])

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  
                  <div class="row">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Printer Request!</h4>
                      </div>
                      <div class="box-body pt-0">
                          <p>Dear {userData.first_name}, to request for a mobile bluetooth printer, kindly send a mail to <a href={'mailto:'+email}>{email}</a> <br/>We will respond as soon as possible.<br/>Thanks!</p>
                      </div>
                  </div>
              </div>
              </div>					
              </div>
            
          </div>	
          <div class="row">
             
              

             
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default PrinterRequest;

const style = {
    logo: {width: 45, heiht: 45}
};