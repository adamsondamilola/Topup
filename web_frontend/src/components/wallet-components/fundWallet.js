import React, { Component, useEffect, useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import Service from '../../services/services';
import ErrorMessage from '../../utilities/errorMessage';
import SuccessMessage from '../../utilities/successMessage';
import LoadingImage from '../loadingImage';
import dateFormat, { masks } from "dateformat";
import RandomString from '../../constants/radomString';


const FundWallet = () => {

    const [transactionId, setTransactionid] = useState(null)
    const [flutterwavePublicKey, setFlutterwavePublicKey] = useState(null)
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [amount, setAmount] = useState(null);
    const [enterAmount, setEnterAmount] = useState(false);
    const [coupon, setCoupon] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [enterCoupon, setEnterCoupon] = useState(false);

    const [bankName, setBankName] = useState(null);
            const [accountName, setAccountName] = useState(null);
            const [accountNumber, setAccountNumber] = useState(null);

            const [monnifyToken, setMonnifyToken] = useState(null);

            const createMonnifyAccount = () => {
                
              setLoading(true)
              fetch(urls.apiurl +'monnify/login/')
                  .then((response) => response.json())
                  .then((json) => {
                      if (json.status == 1) {    
                        setMonnifyToken(JSON.parse(JSON.stringify(json.token)))                    
                        //(json.token)
                      }
                      
                  })
                  .catch((error) => console.error(error))
                  .finally(() => setLoading(false));
                  
                  if(monnifyToken !== null){
                    
                    const postOptions = {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 
                         token: monnifyToken,
                          email: userData.email,
                          username: userData.username
                       })
                  };

                    setLoading(true)
              fetch(urls.apiurl +'monnify/reserveAccount/', postOptions)
                  .then((response) => response.json())
                  .then((json) => {
                      if (json.status == 1) { 
                        //get monnify details 
                        virtualAccountDetails();
                        
                      }
                      
                  })
                  .catch((error) => console.error(error))
                  .finally(() => setLoading(false));
                  
                  }
                  else
                  {
                    
                    createFlutterwaveAccount();
                  }
            }

                         /*////FLUTTERWAVE/////*/
    const createFlutterwaveAccount = () => {
        setLoading(true)        
                      
              const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: userData.email,
                    username: userData.username
                 })
            };
  
              setLoading(true)
        fetch(urls.apiurl +'flutterwave/reserveFlutterwaveAccount/', postOptions)
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) { 
                  //get details 
                  
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

        }
    /*////FLUTTERWAVE/////*/

            const virtualAccountDetails = () => {
              setLoading(true)
              fetch(urls.apiurl +'user/'+ token+'/virtual_account_details/')
                  .then((response) => response.json())
                  .then((json) => {
                      if (json.status == 1) {   
                       // alert(json.monnify.bank_name)                     
                        setBankName(json.result.bank_name)
                        setAccountNumber(json.result.account_number)
                        setAccountName(json.result.account_name)
                        
                      }
                      else {

                        createMonnifyAccount()
                      
                    }
                  })
                  .catch((error) => console.error(error))
                  .finally(() => setLoading(false));
          }

    function CouponCode () {
        setEnterCoupon(true)
    }

    const [transferToAccount, setTransferToAccount] = useState(false)
    function selectPaymentMethod(num){
        getUserDetails()
if(num == "2") CouponCode()
if(num == "1") setTransferToAccount(true)
if(num == "0") setEnterAmount(true)
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
                    if(userData.package_status == 0){
                    setAmount(userData.package_amount)
                    }
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getApiKeys = () => {
        setLoading(true)
        fetch(urls.apiurl +'apis/api_keys')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    let resut = json.result
                    let y = resut.filter(x => x.api_provider == "flutterwave")
                    setFlutterwavePublicKey(y[0].public_key)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    function payWithCard(){
        //getApiKeys()
        let tx = RandomString(21);
        setTransactionid(tx)
        setErrMsg(null)
        if(amount < 100){
            setErrMsg("Amount is too low or invalid")
            //alert(transactionId)
        }else if(transactionId == null){
            setErrMsg("Click again to proceed.")
            //alert(transactionId)
        }else{
            handleFlutterPayment({
                callback: (response) => {
                   console.log(response);
                    closePaymentModal() // this will close the modal programmatically
                },
                onClose: () => {},
              });
        }
    }


    useEffect(()=>{
        getUserDetails();
        virtualAccountDetails();
        if(token == null){
            window.location.replace("/login");
        }
    },[])

    const flutterwaveConfig = {
        //FlutterwaveCheckout({
          public_key: flutterwavePublicKey,
          tx_ref: transactionId,
          amount: amount,
          currency: "NGN",
          payment_options: "fund wallet",
          redirect_url: "/user/"+transactionId+"/verify_transaction",
          meta: {
            consumer_id: 23,
            consumer_mac: "92a3-912ba-1192a",
          },
          customer: {
            email: userData.email,
            phone_number: userData.phone,
            name: userData.first_name,
          },
          customizations: {
            title: "Online Payment",
            description: "Payment for an awesome cruise",
            logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
          },
       // });
      }

      const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

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
: enterAmount ?
<div class="box-body text-center">
<div class="input-group mb-3">
      <input class="form-control" type="text" placeholder="Enter Amount"
      value={amount}
      onChange={e => setAmount(e.target.value)} />
      {isLoading? <LoadingImage /> :
                                <button onClick={()=>payWithCard()} class="btn btn-primary btn-sm"> Proceed </button>
                            }
</div>
</div>
: transferToAccount ? 
<div>
                                  <div class="col-12 mt-3"> For instant funding of wallet, please use the account details below</div>
                                  <div class="col-12 mt-3"> <b>Important:</b> Once you made transfer, please wait for the transaction to be successful before making another transfer. You can refresh your browser to see if it has reflected. (Convenience fee: 50 NGN)<br/></div>
                                  <div class="col-12 mt-3"> 
                      <div>Bank Name</div>
                     <h4>{bankName}</h4> 
                          </div>
                           
                          
                          <div class="col-12 mt-3"> 
                      <div>Account Number</div>
                     <h4>{accountNumber}</h4> 
                          </div>
                           
                          <div class="col-12 mt-3">
                          <div>Account Name</div>
                             <h4>{accountName}</h4>
                          </div>
</div>
:
<div class="box-body text-center">
<div class="row">                                  
<select onChange={(e) => selectPaymentMethod(e.target.value)} className='form-control'>
<option>Select</option>
<option value={"0"}>Fund With Credit Card</option>
<option value={"1"}>Fund With Transfer</option>
<option value={"2"}>Fund With Coupon</option>
</select>
</div>
</div> 
                       }
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

export default FundWallet;

const style = {
    logo: {width: 45, heiht: 45}
};