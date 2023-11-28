import React, { Component, forwardRef, useEffect, useRef, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';
import images from '../../constants/images';
import { useParams } from 'react-router';
import dateFormat, { masks } from "dateformat";
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';

const PayElectricityBill = () => {


    
    const service = [
        {
            id: 8,
            service: "EKEDC TOKEN",
            path: "ekedc",            
            img: images.ekedc 
        },
        {
            id: 9,
            service: "IKEDC TOKEN",
            path: "ikedc",            
            img: images.ikedc 
        },
        {
            id: 10,
            service: "PHEDC TOKEN",
            path: "phdc",            
            img: images.phedc 
        },
        {
            id: 11,
            service: "AEDC TOKEN",
            path: "aedc",            
            img: images.aedc 
        },
        {
            id: 12,
            service: "KEDC TOKEN",
            path: "kedco",            
            img: images.kedc 
        },
        {
            id: 13,
            service: "KDEDC TOKEN",
            path: "kedc",            
            img: images.kdedc 
        },
        {
            id: 14, 
            service: "IBEDC TOKEN",
            path: "ibedc",            
            img: images.ibedc 
        },
        {
            id: 15,
            service: "JEDC TOKEN",
            path: "jedc",            
            img: images.jedc 
        },
        {
            id: 16,
            service: "EEDC TOKEN",
            path: "eedc",            
            img: images.eedc 
        },
        
    ]
   
    const [userData, setUserData] = useState([]);
    const [electricityBillingList, setElectricityBillingList] = useState([]);
    const [selectedDataBillingList, setSelectedDataBillingList] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [meterNumber, setMeterNumber] = useState(null);
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

    const [accountName, setAccountName] = useState(null);
    const [pin, setPin] = useState(null);
    const [commission, setCommission] = useState(0);
    const [purchaseCost, setPurchaseCost] = useState(0);
    const [cashBack, setCashBack] = useState(0);

    let amt = parseFloat(amount)

    const {path} = useParams();
    

    function selectNetwork(id){
        var selected_data = service.filter(x => x.path === path)
if(selected_data !== null){
    setlogo(selected_data[0].img)
    setType(selected_data[0].service)
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
                meter_number: meterNumber,
                amount: parseFloat(amount),
                product_code: network,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'recharge/verify_electricity_data', postOptions)
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
                meter_number: meterNumber,
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

        else if(meterNumber == null){
            setErrMsg("Enter Meter Number")
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
                meter_number: meterNumber,
                amount: parseFloat(amount),
                product_code: network,
                username: userData.username,
                network_desc: networkDesc,
                pin: pin
             })
        };
    
        fetch(urls.apiurl + 'recharge/electricity_subscription', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setSuccessMsg(json.message)
                            //getElectricityTokenPrintDetails(json.insertedTokenId)
                            window.location.href = "/user/"+json.insertedTokenId+"/view_electricity_token";
                            
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
        fetch(urls.apiurl +'recharge/get_electricity_billing')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    let resut = json.result
                  //let y = resut.filter(x => x.data_type != "SME")
                  setElectricityBillingList(resut)
                    var select_bill = resut.filter(x => x.product_code === path+"_prepaid_custom");
                    setCompanyName(select_bill[0].product)
                    setSelectedService(select_bill[0].product)
                    setNetwork(select_bill[0].product_code)
                    
                  
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        selectNetwork(path)
        getUserDetails();
        if(token == null){
            window.location.replace("/login");
        }
        getDataBillingList();
        getElectricityTokenPrintList();
    },[])


    const [cardDetails, setCardDetails] = useState([])
    const getElectricityTokenPrintDetails = (id) => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/'+id+'/get_electricity_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                   setCardDetails(json.result)
                   setPrint(true)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const [electrictyList, setElectrictyList] = useState([])
    const getElectricityTokenPrintList = () => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/get_token_list/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setElectrictyList(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    function openTokenDetails(x){
        window.location.href = "/user/"+x+"/view_electricity_token";
    }

    const [print, setPrint] = useState(false);
    let ref = useRef();
    const ComponentToPrint = forwardRef((props, ref) => {
        return <div className='row' ref={ref}>
                <div class="table-responsive">
    {cardDetails.map(c =>
    <div class="col-xl-4 col-12">
    <div class="table-responsive">     
  <table class="table">
      <tbody>
      <tr>
      <td className='text-center'>{c.product}
          </td>
          <td class="text-end">
      
      </td>
    </tr>
      <tr>
      <th><a href="javascript:void(0)">Token</a></th>
      <td class="text-end">{c.token}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Meter</a></th>
      <td class="text-end">{c.meter_number}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Name</a></th>
      <td class="text-end">{c.meter_name}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Amount</a></th>
      <td class="text-end">{NumberToNaira(c.amount)}</td>
    </tr>
    </tbody>
   </table>
   </div>
   </div>
   )}
</div>      
        </div>;
      });
   

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">{companyName}</h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">


                          {print? <div className='row'>
                          <div class="col-xl-12 col-12">
    <ReactToPrint content={() => ref.current}>
   <PrintContextConsumer>
          {({ handlePrint }) => (
            <button className='btn btn-primary text-right m-5' onClick={handlePrint}>
                Print <i className='fa fa-print'></i>
            </button>
          )}
        </PrintContextConsumer>
        </ReactToPrint>
<ComponentToPrint ref={ref} />
</div>      
 </div> : ''}
                              
                             {checkOut && !print? 
                             
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
                                <th><a href="javascript:void(0)">Meter Number</a></th>
                                <td class="text-end">{meterNumber}</td>
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
                              </tr> : '' }
                              {successMsg != null? 
                                <tr>
                                  <td className='text-center' colSpan={2}>
                                      <i className='fa fa-check-circle fa-3x text-success'></i><br/>
                                      <p>{successMsg}</p>
                                  </td>
                              </tr>
                              : '' }
                              </tbody>
                             </table>
                             {errMsg != null? <ErrorMessage message={errMsg}/> : ''  }
                          </div>
                              </div>
                              
                              : 
                             
                             <div class="row">        
        
{selectPackage && !print ?  <div className='row'>

    

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Meter Number</label>
<div class="input-group">
<div class="input-group-append">
<img src={logo} style={style.logo} />
                                  </div>
<input type="tel" value={meterNumber}
onChange={e => setMeterNumber(e.target.value)} className='form-control'/>                                  
                                  </div>
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Amount</label>
<input 
value={amount}
onChange={e => setAmount(e.target.value) } 
className='form-control'/>
</div>
</div>


<div class="col-xl-12 col-lg-12">
<div class="col-xl-3 col-lg-6">
<div class="box">
{errMsg != null? <ErrorMessage message={errMsg}/> : ''  }
{isLoading? <LoadingImage /> :
<button onClick={()=>verifyInput()} className='btn btn-primary'>Proceed</button>
                            }
</div>
</div>
</div>
</div>
: '' }

     </div>
     }


<div className='row'>
<div class="table-responsive">
    <table className='table table-striped'>
        <tbody>
            <tr>
                <th colSpan={4}>
                    Recent Generated Tokens
                </th>
            </tr>
            <tr>
            <th>
                    Token
                </th>
                <th>
                    Amount
                </th>
                <th>
                    Customer
                </th>
                <th> 
                    Date
                </th>
            </tr>
            {electrictyList.map( ar =>
                <tr onClick={()=>openTokenDetails(ar.id)}>
                    <td>
                        {ar.token.replace('Token : ', '')}
                        </td>
                        <td>
                        {NumberToNaira(ar.amount)}
                        </td>
                        <td>
                        {ar.meter_name}
                        </td>
                        <td>
                        {ar.created_at}
                        </td>
                    </tr>
            )}
        </tbody>
    </table>
</div>
</div> 


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

export default PayElectricityBill;

const style = {
    logo: {width: 50, heiht: 50}
};