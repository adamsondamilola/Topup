import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const Presentation = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);

    const services = [
        {
            id: 1,
            title: "topupearn COMPENSATION PLAN",
            type: "PDF",
            file: require("../../documents/topupearn_COMPENSATION_PLAN.pdf"),
            logo: "file" 
        },
        {
            id: 2,
            title: "topupearn VIDEOS PRESENTATION",
            type: "Video",
            file: require("../../videos/topupearn_Back_Office_Training_Compensation_Plan_How_to_Register_New_Member.mp4"),
            logo: "video-camera" 
        },
    ]

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
                        <h4 class="box-title">Presentation</h4>
                      </div>
                      <div class="box-body pt-0">
                          <p> You can download our presentation PDF file and video below</p>
                      </div>
                  </div>
              </div>

              {services.map(x =>
            <div class="col-xl-6 col-lg-6">
                <a href={x.file} download>  
                  <div class="box">
                      <div class="box-body text-center">
                          <div class="d-flex justify-content-around">
                              <div>
                                  <h6 class="my-0">{x.title}</h6>
                                  <p class="mb-0 text-fade">Download {x.type} <i className='fa fa-download'></i></p>
                              </div>
                              <div class="b-1"></div>
                              <div>
                                  <i className={"fa-2x fa fa-"+x.logo}></i>
                              </div>
                          </div>
                      </div>
                  </div>
                  </a>
              </div>
              
          )}
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

export default Presentation;

const style = {
    logo: {width: 45, heiht: 45}
};