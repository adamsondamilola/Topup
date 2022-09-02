import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const WebsiteSettings = () => {

   
    const [userData, setUserData] = useState([]);

    

    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState(null);
const [lastName, setLastName] = useState(null);
const [phone, setPhone] = useState(null);

const state = {
    file: null,
    base64URL: ""
  };

  const handleFileInputChangeLogo = (fileInput) => {
   if (fileInput) {
        // Size Filter Bytes
        const max_size = 20971520;
  
        if (fileInput.size > max_size) {
            alert('Maximum size allowed is ' + max_size / 1000 + 'Mb') 
        }

        let reader = new FileReader();
        reader.readAsDataURL(fileInput);
        reader.onload = function () {

            setLogo(reader.result)

        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };        
    }    
  };

  const handleFileInputChangeDashboardLogo = (fileInput) => {
    if (fileInput) {
        // Size Filter Bytes
        const max_size = 20971520;
  
        if (fileInput.size > max_size) {
            alert('Maximum size allowed is ' + max_size / 1000 + 'Mb') 
        }

        let reader = new FileReader();
        reader.readAsDataURL(fileInput);
        reader.onload = function () {

            setDashboardLogo(reader.result)

        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };        
    }
    
    
  };

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setPhone(json.result.phone)
                    setFirstName(json.result.first_name)
                    setLastName(json.result.last_name)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
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
    const [email, setEmail] = useState(null);
    const [mailer, setMailer] = useState(null);
    const [officeAddress, setOfficeAddress] = useState(null);
    const [tawkToUrl, setTawkToUrl] = useState(null);


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
                    setEmail(x.email)
                    setMailer(x.mailer)
                    setOfficeAddress(x.office_address)
                    setTawkToUrl(x.tawkto_url)
                    }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }

    const updateAction = () =>{
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                maintain: maintain,
                title: title,
                sub_title: subTitle,
                dashboard_logo: dashboardLogo,
                logo: logo,
                url: url,
                twitter_username: twitterUsername,
                facebook_username: facebookUsername,
                phone: websitePhone,
                whatsapp: whatsapp,
                business_reg: rcNumber,
                email: email,
                mailer: mailer,
                office_address: officeAddress,
                tawkto_url: tawkToUrl,
                token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/update_website_settings', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                           setSuccessMsg(json.message);

                }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }    
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }


    const putToMaintenance = () => {
        if(maintain == 1){
            setMaintain(0);
            updateAction();
        }else{
            setMaintain(1);
            updateAction();
        }
                }

    useEffect(()=>{
        websiteSettings();
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
                        <h4 class="box-title">Update Profile</h4>
                      </div>
                      <div class="box-body pt-0">

                            {isLoading? <LoadingImage /> 
                            : null
                            }
                            <div class="col-xl-12 col-12">
                  {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
              </div>
              
                            {maintain == 1? <div class="input-group mb-3">
                            <button class="btn btn-success btn-sm"> MAINTENANCE IS ON </button> 
                            <button onClick={() => putToMaintenance()} class="btn btn-danger btn-sm"> CLICK TO OFF </button> 
                            </div>
                            :
                            <div class="input-group mb-3">
                            <button class="btn btn-danger btn-sm">MAINTENANCE IS OFF </button> 
                            <button onClick={() => putToMaintenance()} class="btn btn-success btn-sm"> CLICK TO ON </button> 
                            </div>
                            }

                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                                <tr>
                                        <th>Website Title</th>
                                        <td>
                                            <input 
                                    onChange={e => setTitle(e.target.value)} 
                                    value={title}
                                    class="form-control" 
                                    type="text"/>
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Website Sub-Title</th>
                                        <td><input className='form-control' value={subTitle} 
                                         onChange={e => setSubTitle(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>RC Number</th>
                                        <td><input className='form-control' value={rcNumber} 
                                         onChange={e => setRcNumber(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Office Address</th>
                                        <td><input className='form-control' value={officeAddress} 
                                         onChange={e => setOfficeAddress(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Home Logo</th>
                                        <td>
<img style={{display: logoUrl != null? `block` : `none`}} src={logoUrl} width={100} height={50}/>
                                            <input className='form-control' type={"file"} accept="image/*" 
                                         onChange={e => handleFileInputChangeLogo(e.target.files[0])} /></td>
                                    </tr>
                                    <tr>
                                        <th>Dashboard Logo</th>
                                        <td>
                                        <img style={{display: dashboardLogoUrl != null? `block` : `none`}} src={dashboardLogoUrl} width={100} height={50}/>
                                            <input className='form-control' type={"file"} accept="image/*" 
                                         onChange={e => handleFileInputChangeDashboardLogo(e.target.files[0])} /></td>
                                    </tr>
                                    <tr>
                                        <th>Website Link</th>
                                        <td><input className='form-control' value={url} 
                                         onChange={e => setUrl(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td><input className='form-control' 
                                        type={"text"} 
                                        value={email} 
                                         onChange={e => setEmail(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Auto Respond Email</th>
                                        <td><input className='form-control' 
                                        type={"text"} 
                                        value={mailer} 
                                         onChange={e => setMailer(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Hot Line</th>
                                        <td><input className='form-control' 
                                        type={"tel"} 
                                        value={websitePhone} 
                                         onChange={e => setWebsitePhone(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Whatsapp</th>
                                        <td><input className='form-control' 
                                        type={"tel"} 
                                        value={whatsapp} 
                                         onChange={e => setWhatsapp(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Facebook Username</th>
                                        <td><input className='form-control' 
                                        type={"text"} 
                                        value={facebookUsername} 
                                         onChange={e => setFacebookUsername(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>Twitter Username</th>
                                        <td><input className='form-control' 
                                        type={"text"} 
                                        value={twitterUsername} 
                                         onChange={e => setTwitterUsername(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <th>TwakTo API</th>
                                        <td><input className='form-control' 
                                        type={"text"} 
                                        value={tawkToUrl} 
                                         onChange={e => setTawkToUrl(e.target.value)} /></td>
                                    </tr>
                                </tbody>
                                </table>
                                <div class="col-12 mt-3">  

                                 <div class="col-xl-12 col-12">
                  {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
              </div>

                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-primary" onClick={() => updateAction()} type="button">
                                Update
                            </button>
                            }
                            </div>
                                </div>
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

export default WebsiteSettings;

const style = {
    logo: {width: 45, heiht: 45}
};