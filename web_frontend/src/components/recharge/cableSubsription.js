import React, { Component, useEffect, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';
import images from '../../constants/images';

const CableSubscription = () => {


    
    const service = [
        {
            id: 1,
            service: "DSTV",
            type: "DSTV Subscription",
            img: images.dstv, 
            selected: 0,
        },
        {
            id: 2,
            service: "GOTV",
            type: "GOTV Subscription",
            img: images.gotv, 
            selected: 0 
        },
        {
            id: 3,
            service: "STARTIMES",
            type: "STARTIMES Subscription",
            img: images.startimes, 
            selected: 0 
        }
    ]
   
    const [userData, setUserData] = useState([]);
    const [dataBillingList, setDataBillingList] = useState([]);
    const [selectedDataBillingList, setSelectedDataBillingList] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [services, setServices] = useState(service);
    const [selectedService, setSelectedService] = useState(null);
    const [iuc, setIuc] = useState(null);
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

    const [accountName, setAccountName] = useState(null);
    const [pin, setPin] = useState(null);
    const [commission, setCommission] = useState(0);
    const [purchaseCost, setPurchaseCost] = useState(0);
    const [cashBack, setCashBack] = useState(0);

    let amt = parseFloat(amount)

    const resetForm = () =>{
        setIuc(null)
        setNetwork('')
        setLoading(false)
     
    }
    

    function selectNetwork(id){
        //resetForm()
        //setDataBillingList([])
        var objIndex2 = service.findIndex((obj => obj.id != parseInt(id)));
        services[objIndex2].selected = 0;
        var objIndex = service.findIndex((obj => obj.id == parseInt(id)));
        service[objIndex].selected = 1;
        setServices(JSON.parse(JSON.stringify(service)));
        setSelectPackage(true)
        //get selected details
var data = service.filter((obj => obj.id == parseInt(id)));
var selected_data = dataBillingList.filter(x => x.serviceID == data[0].service)
if(selected_data !== null && data !== null){
    setSelectedService(data[0].service)
    setSelectedDataBillingList(selected_data)
    setlogo(data[0].img)
    setLoading(false)
}
 
    }

    const postVerification = () =>{
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                product: selectedService,
                iuc: iuc,
                amount: parseFloat(amount),
                product_code: network,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'recharge/verify_cable_data', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) 
                        {
                            setErrMsg(null)
                            setLoading(false)
                            setCheckOut(true)
                            setAmount(json.amount)
                            setCommission(json.commission)
                            setCashBack(json.cash_back)
                            setPurchaseCost(json.purchase_cost+50)
                            setAccountName(json.name)
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    } 

    const verifyInput = () => {

        let x = {
            product: selectedService,
                iuc: iuc,
                amount: parseFloat(amount),
                product_code: network,
                username: userData.username
        }
        

        setErrMsg(null)
        setLoading(true)

        
        //alert(JSON.stringify(x))
        try {
            var selected_network = selectedDataBillingList.filter(x => x.service_code == network)
        setAmount(selected_network[0].service_amount)
        setNetworkDesc(selected_network[0].service_description)
        setType(selected_network[0].service_description)
        } catch (error) {
            //alert(error+selected_network)
        }

        if(parseFloat(amount) < 1 || amount == null){
           
           // setErrMsg("Package not selected")
           // setLoading(false)
        } 

        else if(iuc == null){
            setErrMsg("Enter IUC Number")
            setLoading(false)
        } 
    
        else if(selected_network == ''){
            setErrMsg("Select a package")
        setLoading(false)
        }

        else      
       {          
        postVerification()
    }  

}

const setAmountAction = (y) => {
    setLoading(false)
    try {
        var selected_network = selectedDataBillingList.filter(x => x.service_code === y);
        if(selected_network !== null) 
        {        
            setAmount(selected_network[0].service_amount)
        }    
        } catch (error) {
            setErrMsg("An error occured. Please try again.")
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
                product: selectedService,
                iuc: iuc,
                amount: parseFloat(amount),
                product_code: network,
                username: userData.username,
                network_desc: networkDesc,
                pin: pin
             })
        };
    
        fetch(urls.apiurl + 'recharge/cable_subscription', postOptions)
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
        fetch(urls.apiurl +'recharge/get_cable_billing')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    let resut = json.result
                  //let y = resut.filter(x => x.data_type != "SME")
                   setDataBillingList(resut)
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
                          <h4 class="box-title">Cable</h4>
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
                                <th><a href="javascript:void(0)">Account Name</a></th>
                                <td class="text-end">{accountName}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">IUC</a></th>
                                <td class="text-end">{iuc}</td>
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
                                <th><a href="javascript:void(0)">Conveniency Fee </a></th>
                                <td class="text-end">{NumberToNaira(50)}</td>
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
{selectPackage ?  <div className='row'>

    
<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Select Package</label>
<select 
value={network}
onChange={e => {setNetwork(e.target.value); setAmountAction(e.target.value);} } 
className='form-control'>
    <option value={""}>--Select--</option>
    {selectedDataBillingList.map(y =>
    <option value={y.service_code}>{y.service_description} - {NumberToNaira(parseFloat(y.service_amount))}</option>
    )}
    </select>
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Enter IUC</label>
<input type="tel" value={iuc}
onChange={e => setIuc(e.target.value)} className='form-control'/>
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

export default CableSubscription;

const style = {
    logo: {width: 50, heiht: 50}
};