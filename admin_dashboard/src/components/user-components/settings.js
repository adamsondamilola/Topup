import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const Settings = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);

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
                        <h4 class="box-title">Settings</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="row mt-5">
                          <Link to={"/user/update_profile"} 
                          className='btn btn-success btn-nm btn-block'>Profile Update</Link>
                      </div>

                      <div class="row mt-5">
                          <Link to={"/user/update_password"} 
                          className='btn btn-danger btn-nm btn-block'>Profile Password</Link>
                      </div>

                      <div class="row mt-5">
                          <Link to={"/user/update_pin"} 
                          className='btn btn-primary btn-nm btn-block'>Profile PIN</Link>
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

export default Settings;

const style = {
    logo: {width: 45, heiht: 45}
};