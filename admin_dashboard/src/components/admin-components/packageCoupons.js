import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';

const PackageCoupons = () => {

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
    /*
    const packageData = [
        {id: 1, package: "Discovery", amount: 5000, amtusd: 10},
        {id: 3, package: "Bronze", amount: 10000, amtusd: 20},
        {id: 3, package: "Silver", amount: 20000, amtusd: 40},
        {id: 4, package: "Gold", amount: 30000, amtusd: 60},
        {id: 5, package: "Emerald", amount: 40000, amtusd: 80},
        {id: 6, package: "Platinum", amount: 50000, amtusd: 100},
        {id: 7, package: "Ex-Platinum", amount: 100000, amtusd: 200},
    ];*/
   
    const [transactions, setTransactions] = useState([]);
    
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [dialCode, setDialCode] = useState(null);
    const [package_, setPackage_] = useState(null);
    const [amount, setAmount] = useState(100);
    const [numberOfCard, setNumberOfCard] = useState(1);
    const [network, setNetwork] = useState(null);
    const [networkName, setNetworkName] = useState(null);
    const [type, setType] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [checkOut, setCheckOut] = useState(false);
    const [print, setPrint] = useState(false);

    const [pin, setPin] = useState(null);
    const [commission, setCommission] = useState(0);
    const [purchaseCost, setPurchaseCost] = useState(0);
    const [cashBack, setCashBack] = useState(0);
    
    const CreatePin = () => {
        setErrMsg(null)
        setSuccessMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                package: package_,
//                amount: amount,
            numbers: numberOfCard,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'admin/create_package_pin', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            getCiuponCodes()
                            setSuccessMsg(json.message)
                            setLoading(false)
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

    const getCiuponCodes = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/package_coupons')
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


    const [couponCode, setCouponCode] = useState(null)
    const searchCouponCode = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ couponCode+'/search_coupon')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setTransactions(json.result)
                    //console.log("dataa"+ transactions)
                }else{
                    alert(json.message)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        getPackages();
        getUserDetails();
        if(token == null){
            window.location.replace("/login");
        }
        getCiuponCodes();
    },[])

    const getList =  <div class="row">					
        <div class="col-xl-12 col-12">
        <div class="box">
            <div class="box-header with-border">
              <h4 class="box-title">Package Coupons</h4>
            </div>
            
            <div class="col-xl-12 col-lg-12">
                <div class="box">
                    <div class="box-body text-center">
                        <div class="input-group mb-3">
                            <input class="form-control" type="text" 
                             onChange={e => setCouponCode(e.target.value)} 
                            placeholder="Enter Coupon or Username" 
                            value={couponCode} />
                            {isLoading? <LoadingImage /> 
                            : <button onClick={()=>{searchCouponCode()}} class="btn btn-primary btn-sm"> Search </button>
                            }
                            </div>
                            </div>
                            </div>
                            </div>

                          <div class="box-body pt-0">
                <div class="table-responsive">
                  <table class="table table-striped">
                      <tbody>
                  <tr>
                           <th><a href="javascript:void(0)">Code</a></th>
                           <th><a href="javascript:void(0)">Package</a></th>
                            <th><a href="javascript:void(0)">User</a></th>                      
                        <th class="text-end">Status</th>
                        <th><span class="text-muted text-nowrap">
                           Date</span> </th>
                    </tr>
                  {transactions.map(tr =>
                    <tr>
                      <td>{tr.coupon}</td>
                      <td><a href="#">{tr.package}</a></td>
                      <td><a href="#">{tr.user}</a></td>
                      {tr.status == 0 ? <td class="text-end text-danger">Available</td> : null}
                      {tr.status == 1 ? <td class="text-end text-success">Used</td> : null}
                      {tr.status == 2 ? <td class="text-end text-warning">Rejected</td> : null}
                      <td><span class="text-muted text-nowrap">
                      {tr.created_at} </span> </td>
                      </tr>
                  )}
                  </tbody>
                   </table>
                </div>
            </div>
        </div>
    </div>				
          
                </div>
    

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  


              </div>
            
          </div>	
          <div class="row card">

<div class="col-xl-12 col-lg-12">
<div class="box">
                                   <label>Select Package</label>
                                    <select class="form-control" onChange={e => setPackage_(e.target.value)}>
                                        <option value={""}>Select</option>
                                        {packageData.map(x =>
                                        <option value={x.package}>
                                        {x.package} {NumberToNaira(x.amount)}
                                        </option>)}
                                    </select>  
                                </div>
</div>

<div class="col-xl-12 col-lg-12">
<div class="box">
<label>Number of Coupons</label>
<select className='form-control form-select' onChange={e => setNumberOfCard(e.target.value)}>
<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>
<option value={4}>4</option>
<option value={5}>5</option>
<option value={6}>6</option>
<option value={7}>7</option>
<option value={8}>8</option>
<option value={9}>9</option>
<option value={10}>10</option>
</select>
</div>
</div>


<div class="col-xl-12 col-lg-12">
<div class="col-xl-3 col-lg-6">
<div class="box">
{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
{successMsg != null? <SuccessMessage message={successMsg}/> : null  }
{isLoading? <LoadingImage /> :
<button onClick={()=>CreatePin()} className='btn btn-primary'>Generate</button>
                            }

</div>
</div>
</div>
             
{isLoading? <LoadingImage /> : getList }
             
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default PackageCoupons;

const style = {
    logo: {width: 45, heiht: 45}
};