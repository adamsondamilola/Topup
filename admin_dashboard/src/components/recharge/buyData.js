import React, { Component, useEffect, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';

const BuyData = () => {

    const days = [
        {id: 1,
            days: 1,
            value: "24 Hours"
        },
        {id: 2,
            days: 2,
            value: "2 Days"
        },
        {id: 3,
            days: 7,
            value: "7 Days"
        },
        {id: 4,
            days: 14,
            value: "14 Days"
        },
        {id: 5,
            days: 30,
            value: "30 Days"
        },
        {id: 6,
            days: 60,
            value: "60 Days"
        },
        {id: 7,
            days: 90,
            value: "90 Days"
        },{id: 8,
            days: 180,
            value: "180 Days"
        },{id: 9,
            days: 365,
            value: "1 Year"
        }
    ]
    const service = [
        {
            id: 1,
            path: "mtn_custom",
            service: "MTN",
            type: "MTN Data",
            img: logos.mtn, 
            selected: 0,
        },
        {
            id: 2,
            path: "glo_custom",
            service: "GLO",
            type: "GLO Data",
            img: logos.glo, 
            selected: 0 
        },
        {
            id: 3,
            path: "airtel_custom",
            service: "AIRTEL",
            type: "AIRTEL Data",
            img: logos.airtel, 
            selected: 0 
        },
        {
            id: 4,
            path: "9mobile_custom",
            service: "9MOBILE",
            type: "9Mobile Data",
            img: logos.nmobile, 
            selected: 0 
        }
        
    ]
   
    const [userData, setUserData] = useState([]);
    const [dataBillingList, setDataBillingList] = useState([]);
    const [selectedDataBillingList, setSelectedDataBillingList] = useState([]);
    const [duration, setDuration] = useState([]);
    const [mtnSmeDataBillingList, setMtnSmeDataBillingList] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [services, setServices] = useState(service);
    const [selectedService, setSelectedService] = useState(null);
    const [phone, setPhone] = useState(null);
    const [amount, setAmount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [networkDesc, setNetworkDesc] = useState(null);
    const [type, setType] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [checkOut, setCheckOut] = useState(false);
    const [selectPackage, setSelectPackage] = useState(false);

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
        setSelectPackage(true)
        //get selected details
var data = service.filter((obj => obj.id == parseInt(id)));
var selected_data = dataBillingList.filter(x => x.network == data[0].service)
setSelectedService(data[0].service)
setSelectedDataBillingList(selected_data)
setlogo(data[0].img)

    }

    function setPreferredDuration(days){
        var selected_data = dataBillingList.filter(x => x.network == selectedService)
       // setSelectedDataBillingList(selected_data)
        var y = selected_data.filter(x => x.days == days)
        setSelectedDataBillingList(y)
    }

    const verifyInput = () => {
        setErrMsg(null)
        setLoading(true)

        var selected_network = selectedDataBillingList.filter(x => x.data_code == network)
       // console.log(selected_network[0].data_amount)
        //alert(JSON.parse(JSON.parse(selected_network[0])))
        setAmount(selected_network[0].data_amount)
        setNetworkDesc(selected_network[0].data_description)
        setType(selected_network[0].data_description)
    
        if(parseFloat(amount) > 0)
       
       { 
           
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: network,
                amount: parseFloat(amount),
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
}  else{
    setLoading(false)
}

}

    const buyDataAction = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: network,
                network_desc: networkDesc,
                amount: amount,
                phone: phone,
                pin: pin,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'recharge/buy_data', postOptions)
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

    const getDataBillingList = () => {
        setLoading(true)
        fetch(urls.apiurl +'recharge/get_data_billing')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    let resut = json.result
                    //filter data
                   // let x = resut.filter(x => x.data_type == "SME")
                    let y = resut.filter(x => x.data_type != "SME")
                    setDataBillingList(y)
//                    console.log(json.result)
//                    console.log(x)
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
        getDataBillingList();
    },[])
   

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Data</h4>
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
                                <button onClick={() => buyDataAction()} className='btn btn-primary'>Confirm</button>
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
{selectPackage ?  <>

    <div class="col-xl-3 col-lg-6">
<div class="box">
<label>Select Duration</label>
<select 
onChange={e => {setDuration(e.target.value); setPreferredDuration(e.target.value)}} 
className='form-control'>
    <option>All</option>
    {days.map(w =>
    <option value={w.days}>{w.value}</option>
    )}
    </select>
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Select Package</label>
<select 
onChange={e => setNetwork(e.target.value)} 
className='form-control'>
    <option></option>
    {selectedDataBillingList.map(y =>
    <option value={y.data_code}>{y.data_description} - {NumberToNaira(parseFloat(y.data_amount))}</option>
    )}
    </select>
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
</>
: null }

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

export default BuyData;

const style = {
    logo: {width: 50, heiht: 50}
};