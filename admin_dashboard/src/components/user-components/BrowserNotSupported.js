import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const BrowserNotSupported = () => {

   
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
                        <h4 class="box-title">Browser Not Supported!</h4>
                      </div>
                      <div class="box-body pt-0">
                          <p>Sorry, our platform is not compatible with this browser. Kindly try another browser</p>
                          <p>Some features will not work. However, below are the browsers we recommend (must be latest version)</p>
                          <ul>
                          <li>Chrome</li>
                          <li>Fire Fox</li>
                          <li>Edge</li>
                          </ul>
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

export default BrowserNotSupported;

const style = {
    logo: {width: 45, heiht: 45}
};