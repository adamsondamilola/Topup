import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const UserProfile = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const copyToClipboard = (text) => {
        const el = text
        window.navigator.clipboard.writeText(text)
        alert("link copied")
      }

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setWallet(json.result.wallet)
                }else{
                    window.location.replace("/login");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const [webSet, setWebSet] = useState([])
    const websiteSettings = () => {    
        getUserDetails();
        fetch(urls.apiurl +'admin/website_settings')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   setWebSet(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
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
                        <h4 class="box-title">Referral Link</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="input-group mb-3">
                                    <button onClick={() => copyToClipboard(webSet.url+"/"+userData.username+"/invite")} class="btn btn-primary" readOnly style={{width:80, fontSize: 15}}>COPY</button>
                                    <input class="form-control text-dark"
                                    type="tel" 
                                    value={webSet.url+"/"+userData.username+"/invite"}/>
                                    </div>
                         </div>
                  </div>
              </div>

              <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Profile</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                                <tr>
                                        <th>First Name</th>
                                        <td>{userData.first_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td>{userData.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Userame</th>
                                        <td>{userData.username}</td>
                                    </tr>
                                    <tr>
                                        <th>Sponsor</th>
                                        <td>{userData.referral}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{userData.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{userData.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Country</th>
                                        <td>{userData.country}</td>
                                    </tr>
                                </tbody>
                                </table>
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

export default UserProfile;

const style = {
    logo: {width: 45, heiht: 45}
};