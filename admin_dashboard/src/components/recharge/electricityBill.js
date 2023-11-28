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
import { Link } from 'react-router-dom';
const ElectricityBill = () => {

    const services = [
        {
            id: 8,
            service: "EKEDC TOKEN",
            path: "ekedc",
            subText: "Purchase",
            img: images.ekedc 
        },
        {
            id: 9,
            service: "IKEDC TOKEN",
            path: "ikedc",
            subText: "Purchase",
            img: images.ikedc 
        },
        {
            id: 10,
            service: "PHEDC TOKEN",
            path: "phdc",
            subText: "Purchase",
            img: images.phedc 
        },
        {
            id: 11,
            service: "AEDC TOKEN",
            path: "aedc",
            subText: "Purchase",
            img: images.aedc 
        },
        {
            id: 12,
            service: "KEDC TOKEN",
            path: "kedco",
            subText: "Purchase",
            img: images.kedc 
        },
        {
            id: 13,
            service: "KDEDC TOKEN",
            path: "kedc",
            subText: "Purchase",
            img: images.kdedc 
        },
        {
            id: 14,
            service: "IBEDC TOKEN",
            path: "ibedc",
            subText: "Purchase",
            img: images.ibedc 
        },
        {
            id: 15,
            service: "JEDC TOKEN",
            path: "jedc",
            subText: "Purchase",
            img: images.jedc 
        },
        {
            id: 16,
            service: "EEDC TOKEN",
            path: "eedc",
            subText: "Purchase",
            img: images.eedc 
        },
        
    ]
    
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingPackage, setPendingPackage] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [pin, setPin] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [enterCoupon, setEnterCoupon] = useState(false);

    const [coupon, setCoupon] = useState(null);

    function CouponCode () {
        setEnterCoupon(true)
    }

    const activateWithCoupon = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                    coupon: coupon,
                    username: userData.username,
                    package: userData.package
             })
        };
    
        fetch(urls.apiurl + 'coupon/activate_with_coupon', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setPendingPackage(null)
                            setSuccessMsg("Account Successfully Activated")
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
                    if(json.result.pin == null){
                        window.location.replace("/user/create_pin");
                    }
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const checkPendingPackage = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/check_pending_package')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setPendingPackage(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getTransactions = () => {
        setLoading(true)
        fetch(urls.apiurl +'transaction/'+ token+'/10/transactions')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setTransactions(json.result)
                    //console.log("dataa"+ transactions)
                }
            })
            .catch((error) => console.error("Goterr "+error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        getUserDetails();
        if(token == null){
            window.location.replace("/login");
        }
        
        checkPendingPackage();
        getTransactions();
//        console.log(token)
    },[])

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
          <div class="row">
         
          {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

          
          {services.map(x =>
            <div class="col-xl-3 col-lg-6">
                <Link to={"/user/"+x.path+"/pay"}>  
                  <div class="box">
                      <div class="box-body text-center">
                          <div class="d-flex justify-content-around">
                              <div>
                                  <h6 class="my-0">{x.service}</h6>
                                  <p class="mb-0 text-fade">{x.subText}</p>
                              </div>
                              <div class="b-1"></div>
                              <div>
                                  <img src={x.img} style={style.logo} />
                              </div>
                          </div>
                      </div>
                  </div>
                  </Link>
              </div>
              
          )}
              
          </div>	
          
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default ElectricityBill;

const style = {
    logo: {width: 45, heiht: 45}
};