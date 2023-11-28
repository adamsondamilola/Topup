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
import platform from 'platform';

const Dashbaord = () => {

    const services = [
        {
            id: 1,
            service: "WALLETS",
            path: "wallet",
            subText: "View",
            img: logos.wallet 
        },
        {
            id: 2,
            service: "SPECIAL BUNDLES",
            path: "mtn_special",
            subText: "Subscribe",
            img: logos.data 
        },
        {
            id: 3,
            service: "AIRTIME",
            path: "buy_airtime",
            subText: "Purchase",
            img: logos.airtime 
        },
        {
            id: 4,
            service: "NONE SME DATA",
            path: "none_sme_data",
            subText: "Subscribe",
            img: logos.data 
        },
        {
            id: 5,
            service: "PRINT AIRTIME",
            path: "print_airtime",
            subText: "Print",
            img: logos.print_airtime 
        },
        /*
        {
            id: 6,
            service: "BULK SMS",
            path: "buy_bulk_sms",
            subText: "Purchase",
            img: logos.sms 
        },
        */
         {
            id: 8,
            service: "CABLE TV",
            path: "cable_tv",
            subText: "Subscribe",
            img: logos.cable_tv 
        },
        {
            id: 9,
            service: "ELECTRICITY",
            path: "electricity",
            subText: "Pay bill",
            img: logos.electricity 
        },
        {
            id: 7,
            service: "PRINT RECEIPT",
            path: "transactions",
            subText: "Print Receipt",
            img: logos.print_airtime 
        },
/*        {
            id: 7,
            service: "BULK SMS",
            path: "send_sms",
            subText: "Send SMS",
            img: logos.sms 
        },
       {
            id: 10,
            service: "FOREIGN AIRTIME",
            path: "foreign_airtime",
            subText: "Purchase",
            img: images.international 
        },
        {
            id: 11,
            service: "EDUCATIONAL PINS",
            path: "educational_pins",
            subText: "Purchase",
            img: images.educational 
        }  */   
    ]
    
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingPackage, setPendingPackage] = useState([]);
    const [pendingPackage_, setPendingPackage_] = useState(false);
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


    /*/////MONNIFY//////*/

      const [monnifyToken, setMonnifyToken] = useState(null);
      const [monnifyReference, setMonnifyReference] = useState(null);

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
                  
                }
                
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
            }
            else 
                {
                    createFlutterwaveAccount(); //Create flutterwave if monnify fails.
                }
      }
    /*////MONNIFY/////*/

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
                        if (json.status === 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setPendingPackage([])
                            setPendingPackage_(false)
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
                if (json.status === 1) {
                    setUserData(json.result)
                    setWallet(json.wallet[0])
                    getTransactions();                      
                    if(json.result.pin == null){
                        window.location.replace("/user/create_pin");
                    }
                }else{
                    window.location.replace("/login");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const checkLogin = () => {
        setLoading(true)
        fetch(urls.apiurl +'auth/'+ token+'/verify_login_token/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 0) {
                    window.location.replace("/login");
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
                if (json.status === 1) {
                    setPendingPackage(json.result)
                    setPendingPackage_(true)

                }else{
                    setPendingPackage([])
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
                if (json.status === 1) {
                    setTransactions(json.result)
                    //console.log("dataa"+ transactions)
                }
            })
            .catch((error) => console.error("Goterr "+error))
            .finally(() => setLoading(false));
    }


    const activatePackageWithWallet = () => {
        setLoading(true)
        fetch(urls.apiurl +'transaction/'+ token+'/activate_package_from_wallet')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                    setSuccessMsg(json.message)
                    //console.log("dataa"+ transactions)
                }
                else if(json.result == "Empty"){
                    window.location.replace("/user/fund_wallet");
                }
                else{
                    setErrMsg(json.message)
                }
            })
            .catch((error) => console.error("Goterr "+error))
            .finally(() => setLoading(false));
    }

    const redirectBrowserNotSupported = () => {

        if(platform.name === "Safari")
        {
          window.location.replace('/user/browser_not_supported')
        }
      }


      const [bankName, setBankName] = useState(null);
      const [accountName, setAccountName] = useState(null);
      const [accountNumber, setAccountNumber] = useState(null);
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


    const copyToClipboard = (text) => {
        const el = text
        window.navigator.clipboard.writeText(text)
        alert("Account number copied")
      }


    useEffect(()=>{
        if(userData == ""){
            getUserDetails();             
            checkPendingPackage();         
        }

        virtualAccountDetails(); 
            
        if(token == null){
            window.location.replace("/login");
        }

        //redirectBrowserNotSupported();

    }, [transactions])



    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
          <div class="row">

          <div class="col-xl-12 col-12">
                  {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
              </div>

{userData.package == "Free Account" ? 
<div class="col-xl-12 col-lg-12">
          <div className='card'>
          <div class="box-body text-center">
                          <div class="d-flex justify-content-around">
                              <div>
                                  <h6 class="my-0"><span className='text-danger'> Free Account! </span></h6>
                                  <p class="mb-0 text-fade">{NumberToNaira(0)}</p>
                              </div>
                              <div class="b-1"></div>
                              <div>
                                <Link to={"/user/upgrade"} className='btn btn-success m-5'>
                                  UPGRADE <i className='fa fa-arrow-up'></i>
                                  </Link>
                              </div>
                          </div>
                      </div>                      
          </div>
          </div>
         : '' }

       
{bankName != null? 
    <div class="col-xl-12 col-lg-12">
          <div className='card'>
          <div class="box-body text-center">
                          <div class="d-flex justify-content-around">
                              <div>
                              <h6 class="my-0"><span className='text-success'> {bankName} </span></h6>
                                  <p class="mb-0 text-dark">{accountNumber}</p>
                                  <h6 class="my-0"><span className='text-success'> {accountName} </span></h6>
                               </div>
                              <div class="b-1"></div>
                              <div>
                                <button onClick={() => copyToClipboard(accountNumber)} className='btn btn-success m-5'>
                                  Copy <i className='fa fa-copy'></i>
                                  </button>
                              </div>
                          </div>
                      </div> 
                      </div>    
                                      
          </div>
         : '' }
         <div class="col-xl-12 col-lg-12">
         <div className='card bg-success'>
          <div class="box-body text-center">
                          <div class="d-flex justify-content-around">
                          <div>
                          Kindly note that wallet funding greater than 5,000 NGN should be sent to the account details below and use your username or email address as description.
                          <hr className='bg-white'/>
                        
                        <div>
                              <h6 class="my-0"><span className='text-white'> Union Bank </span></h6>
                                  <p class="mb-0 text-white">0094914329</p>
                                  <h6 class="my-0"><span className='text-white'> Remo Times Global </span></h6>
                               </div>
                               </div>
                        </div>
                        </div>
                        </div>
         </div>

          {pendingPackage_ ? 
          <div class="col-xl-12 col-lg-12">
<div class="box">

{enterCoupon ?
<div class="box-body text-center">
<div class="input-group mb-3">
      <input class="form-control" type="text" placeholder="Enter Coupon Code"
      value={coupon}
      onChange={e => setCoupon(e.target.value)} />
      {isLoading? <LoadingImage /> :
                                <button onClick={()=>activateWithCoupon()} class="btn btn-primary btn-sm"> Activate Package </button>
                            }
</div>
</div>
:
                      <div class="box-body text-center">
                          <div class="d-flex justify-content-around">
                              <div>
                                  <h6 class="my-0">{pendingPackage.package} <span className='text-danger'> - Pending</span></h6>
                                  <p class="mb-0 text-fade">{NumberToNaira(pendingPackage.amount)}</p>
                              </div>
                              <div class="b-1"></div>
                              <div>
                              {isLoading? <LoadingImage /> :
                                <button onClick={() => activatePackageWithWallet()} className='btn btn-primary m-5'>Pay Now!</button>
                            }
                              
                                <button type='button' onClick={() => CouponCode()} className='btn btn-success m-5'>
                                  Use PIN
                                  </button>
                              </div>
                          </div>
                      </div>
                       }
                  </div>
          </div>
        : null}

          {services.map(x =>
            <div class="col-xl-3 col-lg-6">
                <Link to={"/user/"+x.path}>  
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
          <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Account Overview</h4>
                         </div>
                      <div class="box-body">
                          <div class="row mb-20">
                                 <div class="row">
                                  
                                 <div class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Package</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{userData.package}</span>
					<span class="fa fa-cube fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Referrals</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{userData.referrals}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Referral Commission</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.referral_balance)}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>
                                
                  
                  
            <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Cashback Allocated</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.cashback_balance)} </span>
					<span class="fa fa-database fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Cashback Withdrawn</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.cashback_withdrawn)} </span>
					<span class="fa fa-bank fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Cashback Pending</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.cashback_pending)} </span>
					<span class="fa fa-refresh fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

                              </div>
                          </div>
                          
                      </div>
                  </div>
                  <div class="row">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Last 10 Transactions</h4>
                      </div>
                      <div class="box-body pt-0">
                          <div class="table-responsive">
                            <table class="table mb-0">
                            <tr>
                                <td><a href="javascript:void(0)">Type</a></td>
                                <td><span class="text-muted text-nowrap">
                                     Date</span> </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">Amount</span>
                                    </div>
                                </td>
                                <td class="text-end">Status</td>
                              </tr>
                            {transactions.map(tr =>
                              <tr>
                                <td><a href="#">{tr.type}</a></td>
                                <td><span class="text-muted text-nowrap">
                                    {tr.created_at} </span> </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">{NumberToNaira(tr.amount)}</span>
                                    </div>
                                </td>
                                {tr.status == 0 ? <td class="text-end text-danger">Pending</td> : ''}
                                {tr.status == 1 ? <td class="text-end text-success">Successful</td> : ''}
                                {tr.status == 2 ? <td class="text-end text-warning">Declined</td> : ''}
                              </tr>
                            )}
                             </table> 
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

export default Dashbaord;

const style = {
    logo: {width: 45, heiht: 45}
};