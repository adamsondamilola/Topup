import React, { Component, useEffect, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';

const Withdraw = () => {

    const wallet_types = [
        {id: 1,
            slug: "cash_back",
            value: "Cash Back"
        },
        {id: 2,
            slug: "referral",
            value: "Referral Commission"
        }
    ]
    const service = [
        {
            id: 1,
            path: "wallet",
            service: "Main Wallet",
            type: "Withdraw to wallet",
            img: "fa fa-window-maximize fa-3x", 
            selected: 0,
        },
        
        {
            id: 2,
            path: "bank",
            service: "Bank",
            type: "Withdraw to bank",
            img: "fa fa-university fa-3x", 
            selected: 0 
        },
        /*
        {
            id: 3,
            path: "coupon",
            service: "Coupon",
            type: "Convert to coupon",
            img: "fa fa-cube fa-3x", 
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
        } */
        
    ]
   
    const [userData, setUserData] = useState([]);
    const [dataBillingList, setDataBillingList] = useState([]);
    const [selectedDataBillingList, setSelectedDataBillingList] = useState([]);
    const [slug, setSlug] = useState(null);
    const [wallet, setWallet] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [logo, setlogo] = useState(null);
    const [services, setServices] = useState(service);
    const [selectedService, setSelectedService] = useState(null);
    const [amount, setAmount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [networkDesc, setNetworkDesc] = useState(null);
    const [type, setType] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [checkOut, setCheckOut] = useState(false);
    const [selectPackage, setSelectPackage] = useState(true);

    const [pin, setPin] = useState(null);
    const [bankName, setBankName] = useState(null);

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
        var networkSelected = data[0].service;
        getDataBillingList(networkSelected)

        var selected_data = dataBillingList.filter(x => x.network == data[0].service)
        setSelectedService(data[0].service)
        setNetworkDesc(data[0].type)
        setNetwork(data[0].service)
        setSelectedDataBillingList(selected_data)
        setlogo(data[0].img)

    }

    const verifyInput = () => {
        setErrMsg(null)
        setLoading(true)
        
if(bankName === null){
setErrMsg("Your account is not linked to a bank account yet. To add a bank account, click Bank Account under Account in the navigation menu.");
}

       else if(parseFloat(amount) > 0)
       
       { 
        
        if(slug == "Referral Commission")
        {
            setSlug("referral")
        }
        if(slug == "Cash Back")
        {
            setSlug("cash_back")
        }

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: network,
                wallet: selectedWallet,
                amount: parseFloat(amount),
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'transaction/verify_withdrawal_input', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setCheckOut(true)
                            
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

const restartTransaction = () => {
    setCheckOut(false);
    setSuccessMsg(null);
    setErrMsg(null);
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
                slug: slug,
                pin: pin,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'transaction/withdraw', postOptions)
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
                    setBankName(json.bank.bank_name)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getDataBillingList = (network) => {
        setLoading(true)
        fetch(urls.apiurl +'recharge/get_data_billing')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    let resut = json.result
                    //filter data
                   // let x = resut.filter(x => x.data_type == "SME")
                    let y = resut.filter(x => x.data_type == "SME" && x.network == network)
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
      //  getDataBillingList();
    },[])
   

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Withdraw</h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">
                              
                             {checkOut? 
                             
                             <div className='row'>
                              <div class="table-responsive">
                            <table class="table mb-0">
                                <tbody>
                                <tr>
                                <th><a href="javascript:void(0)">Wallet</a></th>
                                <td class="text-end">{selectedWallet}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Mode</a></th>
                                <td class="text-end">{network}</td>
                              </tr>
                              <tr>
                                <td colSpan={2} class="text-end">{networkDesc}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Amount </a></th>
                                <td class="text-end">{NumberToNaira(parseFloat(amount))}</td>
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
                              <tr>
                                <th><a href="javascript:void(0)"> </a></th>
                                <td class="text-end"><button onClick={() => restartTransaction()} className='btn btn-secondary'>Back</button></td>
                              </tr>
                              </tbody>
                             </table>
                             {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                          </div>
                              </div>
                              
                              : 
                             
                             <div class="row">  
                             <div>Where do you want to Transfer or convert your earnings to? Select an option below</div>      
        {services.map(x =>
        <div onClick={() => selectNetwork(x.id)} class="col-xl-3 col-lg-6">
        <div class="box">
            <div class="box-body text-center">
                <div class="d-flex justify-content-around">
                <div>
                        <i className={x.img} style={style.logo} />
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



<div class="col-xl-12 col-lg-12">

<div className='row'>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Enter Amount</label>
<input type="tel" value={amount}
onChange={e => setAmount(e.target.value)} className='form-control'/>
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Select a Wallet</label>
<select 
onChange={e => {setSlug(e.target.value); setSelectedWallet(e.target.value);}} 
className='form-control'>
    <option></option>
    {wallet_types.map(y =>
    <option value={y.value}>{y.value}</option>
    )}
    </select>
</div>
</div>

<div class="col-xl-12 col-lg-6">
<div class="box">
<br/>
{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
{isLoading? <LoadingImage /> :
<button onClick={()=>verifyInput()} className='btn btn-primary'>Proceed</button>
}

</div>
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

export default Withdraw;

const style = {
    logo: {width: 50, heiht: 50}
};