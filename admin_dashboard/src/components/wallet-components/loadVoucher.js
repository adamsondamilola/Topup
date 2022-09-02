import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import Service from '../../services/services';
import ErrorMessage from '../../utilities/errorMessage';
import SuccessMessage from '../../utilities/successMessage';
import LoadingImage from '../loadingImage';
import dateFormat, { masks } from "dateformat";

const LoadVoucher = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [coupon, setCoupon] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [enterCoupon, setEnterCoupon] = useState(true);

    function CouponCode () {
        setEnterCoupon(true)
    }

    function selectPaymentMethod(num){
if(num == "2") CouponCode()
    }

    const fundWithCoupon = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                    coupon: coupon,
                    username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'coupon/fund_with_coupon', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setSuccessMsg("Fund Successfully Added")
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
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
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Fund Wallet</h4>
                         </div>
                      <div class="box-body">
                          
                          
                           {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }


          <div class="col-xl-12 col-lg-12">
<div class="box">

{enterCoupon ?
<div class="box-body text-center">
<div class="input-group mb-3">
      <input class="form-control" type="text" placeholder="Enter Coupon Code"
      value={coupon}
      onChange={e => setCoupon(e.target.value)} />
      {isLoading? <LoadingImage /> :
                                <button onClick={()=>fundWithCoupon()} class="btn btn-primary btn-sm"> Fund Wallet </button>
                            }
</div>
</div>
:
null  }
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

export default LoadVoucher;

const style = {
    logo: {width: 45, heiht: 45}
};