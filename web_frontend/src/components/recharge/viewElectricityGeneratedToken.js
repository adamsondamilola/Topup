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

const ElectricityGeneratedToken = () => {
    
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

    const {id} = useParams();
    


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
if(userData == ""){
    getUserDetails();
}
if(cardDetails == ""){
    getElectricityTokenPrintDetails(id);
}
if(electrictyList == ""){
    getElectricityTokenPrintList();
}
        
        if(token == null){
            window.location.replace("/login");
        }
        
        
    })


    const [cardDetails, setCardDetails] = useState([])
    const getElectricityTokenPrintDetails =  (_id) => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/'+_id+'/get_electricity_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   // alert(json.result)
                   setCardDetails([json.result])
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

    const [print, setPrint] = useState(true);
    let ref = useRef();
    const ComponentToPrint = forwardRef((props, ref) => {
        return <div className='row' ref={ref}>
                <div class="table-responsive">
    {cardDetails.map(el =>
    <div class="col-xl-4 col-12">
    <div class="table-responsive">     
  <table class="table">
      <tbody>
<tr>
      <td colSpan={2} className='text-center'>{el.service}
          </td>
          <td class="text-end">
      
      </td>
    </tr>
      <tr>
      <td colSpan={2} class="text-center"><b>{el.token}</b></td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Meter</a></th>
      <td class="text-end">{el.meter_number}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Name</a></th>
      <td class="text-end">{el.meter_name}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Amount</a></th>
      <td class="text-end">{NumberToNaira(el.amount)}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Date</a></th>
      <td class="text-end">{el.created_at}</td>
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
                          <h4 class="box-title">Electricity Token</h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">


                          {print === true? <div className='row'>
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

export default ElectricityGeneratedToken;

const style = {
    logo: {width: 50, heiht: 50}
};