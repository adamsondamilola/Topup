import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import ErrorMessage from '../../utilities/errorMessage';

const UpgradePackage = () => {
   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [currentPackage, setCurrentPackage] = useState(null);
    const [newPackage, setNewPackage] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

   /* const packageData = [
        {id: 1, package: "Discovery", amount: 5000, amtusd: 10},
        {id: 3, package: "Bronze", amount: 10000, amtusd: 20},
        {id: 3, package: "Silver", amount: 20000, amtusd: 40},
        {id: 4, package: "Gold", amount: 30000, amtusd: 60},
        {id: 5, package: "Emerald", amount: 40000, amtusd: 80},
        {id: 6, package: "Platinum", amount: 50000, amtusd: 100},
        {id: 7, package: "Ex-Platinum", amount: 100000, amtusd: 200},
    ]; */

    const [packageData, setPackageData] = useState([])
const getPackages = () => {
    fetch(urls.apiurl +'general/packages')
                .then((response) => response.json())
                .then((json) => {
                    if (json.status == 1) {
                        setPackageData(json.result)
                        //window.location.replace("/user/dashboard");
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
                    setCurrentPackage(json.result.package)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        getPackages()
        getUserDetails();
        if(token == null){
            window.location.replace("/login");
        }
   
    },[])

    const upgradeAction = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                    package: newPackage,
                    username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'user/upgrade', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            window.location.replace("/user/dashboard")
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

    
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
                        <h4 class="box-title">Upgrade Package</h4>
                      </div>
                      <div class="box-body pt-0">
                     
                      <div class="col-6 mt-3">
                                <div class="form-group">
                                    <label>Current Package</label>
                                    <input 
                                    value={currentPackage}
                                    class="form-control" 
                                    readOnly
                                    type="text"/>
                                </div>
                            </div>

                      <div class="col-6 mt-3">
                                <div class="form-group">
                                    <label>Select Package</label>
                                    <select class="form-control" onChange={e => setNewPackage(e.target.value)}>
                                        <option value={""}>Select</option>
                                        {packageData.map(x =>
                                        <option value={x.package}>
                                        {x.package} {userData.country == "Nigeria"?NumberToNaira(x.amount): "$200"}
                                        </option>)}
                                    </select>
                                </div>                                
                            </div>

                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }

                            <div class="col-12 mt-3">                            
                                {isLoading? <LoadingImage /> :
                                <button onClick={() => upgradeAction()} class="btn btn-primary" type="button">
                                Submit
                            </button>
                            }
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

export default UpgradePackage;

const style = {
    logo: {width: 45, heiht: 45}
};