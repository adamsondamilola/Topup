import React, { Component, useEffect, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import images from '../../constants/images';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';

const BuyAirtime = () => {

    const service = [
        {
            id: 1,
            path: "mtn_custom",
            service: "MTN",
            type: "MTN Airtime",
            img: logos.mtn, 
            selected: 0 
        },
        {
            id: 2,
            path: "glo_custom",
            service: "GLO",
            type: "GLO Airtime",
            img: logos.glo, 
            selected: 0 
        },
        {
            id: 3,
            path: "airtel_custom",
            service: "AIRTEL",
            type: "AIRTEL Airtime",
            img: logos.airtel, 
            selected: 0 
        },
        {
            id: 4,
            path: "9mobile_custom",
            service: "9Mobile",
            type: "9Mobile Airtime",
            img: logos.nmobile, 
            selected: 0 
        }
        
    ]
   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [services, setServices] = useState(service);
    const [phone, setPhone] = useState(null);
    const [amount, setAmount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [type, setType] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [checkOut, setCheckOut] = useState(false);

    const [pin, setPin] = useState(null);
    const [commission, setCommission] = useState(0);
    const [purchaseCost, setPurchaseCost] = useState(0);
    const [cashBack, setCashBack] = useState(0);

    let amt = parseFloat(amount)

    function selectNetwork(id){
        var objIndex2 = service.findIndex((obj => obj.id != parseInt(id)));
        services[objIndex2].selected = 0;
        var objIndex = service.findIndex((obj => obj.id == parseInt(id)));
        service[objIndex].selected = 1;
        setServices(JSON.parse(JSON.stringify(service)));

        //get selected details
var data = service.filter((obj => obj.id == parseInt(id)));
setNetwork(data[0].path)
setType(data[0].type)
setlogo(data[0].img)

    }

    const verifyInput = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: network,
                amount: amount,
                phone: phone,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'recharge/verify_input', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setCheckOut(true)
                            setAmount(json.amount)
                            setCommission(json.commission)
                            setCashBack(json.cash_back)
                            setPurchaseCost(json.purchase_cost)
//                            setSuccessMsg("Fund Successfully Added")
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

    const buyAirtimeAction = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: network,
                amount: amount,
                phone: phone,
                pin: pin,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'recharge/buy_airtime', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setSuccessMsg(json.message)
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
                          <h4 class="box-title">Airtime</h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">
                              
                             {checkOut? 
                             
                             <div className='row'>
                              <div class="table-responsive">
                            <table class="table mb-0">
                                <tbody>
                                <tr>
                                <td className='text-center' colSpan={2} class="text-end">
                                <img src={logo} style={style.logo} />
                                </td>
                              </tr>
                                <tr>
                                <th><a href="javascript:void(0)">Service</a></th>
                                <td class="text-end">{type}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Phone</a></th>
                                <td class="text-end">{phone}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Commission</a></th>
                                <td class="text-end">{commission}%</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Actual Cost </a></th>
                                <td class="text-end">{NumberToNaira(amt)}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Purchase Cost</a></th>
                                <td class="text-end">{NumberToNaira(purchaseCost)}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Cash back</a></th>
                                <td class="text-end">{NumberToNaira(cashBack)}</td>
                              </tr>
                          {successMsg == null?    <tr>
                                <th><input type="password" value={pin}
      onChange={e => setPin(e.target.value)} 
      maxLength='4'
      placeholder='Enter PIN'
      className='form-control'/></th>
                                <td class="text-end">
                                {isLoading? <LoadingImage /> :
                                <button onClick={() => buyAirtimeAction()} className='btn btn-primary'>Confirm</button>
                            }
                            </td>
                              </tr> : null }
                              {successMsg != null? 
                                <tr>
                                  <td className='text-center' colSpan={2}>
                                      <i className='fa fa-check-circle fa-3x text-success'></i><br/>
                                      <p>{successMsg}</p>
                                  </td>
                              </tr>
                              : null }
                              </tbody>
                             </table>
                             {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                          </div>
                              </div>
                              
                              : 
                             
                             <div class="row">        
        {services.map(x =>
        <div onClick={() => selectNetwork(x.id)} class="col-xl-3 col-lg-6">
        <div class="box">
            <div class="box-body text-center">
                <div class="d-flex justify-content-around">
                <div>
                        <img src={x.img} style={style.logo} />
                    </div>
                    <div class="b-1"></div>
                    {x.selected ? <i className='fa fa-check-circle fa-3x text-success'></i>
                    : 
                    <div>
                        <h6 class="my-0">{x.service}</h6>
                        <p class="mb-0 text-fade">select</p>
                    </div>
                    }
                   
                </div>
            </div>
        </div>
    </div>
        )}
<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Enter Amount</label>
<input type="tel" value={amount}
onChange={e => setAmount(e.target.value)} 
className='form-control'/>
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Enter Phone</label>
<input type="tel" value={phone}
onChange={e => setPhone(e.target.value)} className='form-control'/>
</div>
</div>

<div class="col-xl-12 col-lg-12">
<div class="col-xl-3 col-lg-6">
<div class="box">
{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
{isLoading? <LoadingImage /> :
<button onClick={()=>verifyInput()} className='btn btn-primary'>Proceed</button>
                            }

</div>
</div>
</div>

     </div>
     }



                             </div>                          
                      </div>
                  </div>					
              </div>
            
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default BuyAirtime;

const style = {
    logo: {width: 50, heiht: 50}
};