import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const Wallet = () => {

  const [website, setWebsite] = useState([]);
  const websiteSettings = () => {        
    fetch(urls.apiurl +'admin/website_settings')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1) {
                var x = json.result;
                setWebsite(x)
                }
        })
        .catch((error) => console.error(error))
        .finally(() => console.log("done"));
}

    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [bankName, setBankName] = useState(null);
            const [accountName, setAccountName] = useState(null);
            const [accountNumber, setAccountNumber] = useState(null);
            const [monnifyReference, setMonnifyReference] = useState(null);

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
                        setMonnifyReference(json.result.account_reference)
                        
                      }
                      else
                      {
                        
                        createMonnifyAccount();
                        

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
                    setWallet(json.wallet[0])
                }else{
                  window.location.replace("/login");
              }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }


    useEffect(()=>{
      websiteSettings()
        getUserDetails();
        virtualAccountDetails();
        if(token == null){
            window.location.replace("/login");
        }

      //    getTransactions();

    }, [])

    const [learnMore, setLearnMore] = useState(false);
    
    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Wallet | </h4>
                          <Link to={"/user/fund_wallet"} className="m-10"><h4 class="box-title text-success">Fund Wallet 
                          <i className='fa fa-plus m-5'></i> </h4>
                          </Link>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">
                                 <div class="row">

                                 {accountName !== null?       
                                 <div class="row">
                                {!learnMore ? <div class="col-12 mt-3"> For instant funding of wallet, please use the account details below. <b onClick={ ()=>{setLearnMore(true)}}>Learn more.</b></div> : 
                                <div>
                                <div class="col-12 mt-3"> You can credit your main wallet by transferring the amount you want to deposit to the below account details assigned to you.</div> 
                                <div class="col-12 mt-3"> Deposit will usually reflect on your wallet in 5 minutes, however, there may be instances when it might take more than that. Report to us if transaction takes more than 60 minutes.</div> 
                                <div class="col-12 mt-3"> <b>Important:</b> Once you made transfer, please wait for the transaction to be successful before making another transfer. You can refresh your browser to see if it has reflected. (Convenience fee: 50 NGN)<br/></div> 
                                </div>
                                }
                          <div class="col-xl-4 col-12"> 
                      <div>Bank Name</div>
                     <h4>{bankName}</h4> 
                          </div>
                           
                          
                          <div class="col-xl-4 col-12"> 
                      <div>Account Number</div>
                     <h4>{accountNumber}</h4> 
                          </div>
                           
                          <div class="col-xl-4 col-12">
                          <div>Account Name</div>
                             <h4>{accountName}</h4>
                          </div>
</div>
     :  '' }
                                  
                                 <div class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Main Wallet</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.main_wallet)}</span>
					<span class="fa fa-cube fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

      <div style={{display: website.package_type == "affiliate" ? `none` : `block` }} class="col-xl-4 col-12">
				<div class="box box-body bg-danger">
				  <h6 class="text-uppercase text-white">Points</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{wallet.points}</span>
					<span class="fa fa-shield fs-40"><span class="path1"></span><span class="path2"></span></span>
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
				<div class="box box-body bg-danger">
				  <h6 class="text-uppercase text-white">Commission Withdrawn</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.referral_withdrawn)}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>
                                
                  
            <div class="col-xl-4 col-12">
				<div class="box box-body bg-warning">
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

      <Link to='/user/withdraw' class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Withdraw</h6>
				  <div class="flexbox mt-2">
					<span>Click to withdraw </span>
					<span class="fa fa-arrow-down fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</Link>

                              </div>
                          </div>
                          
                      </div>
                  </div>
                  
               {/*   <div class="row">					
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
                                {tr.status === 0 ? <td class="text-end text-danger">Pending</td> : ''}
                                {tr.status === 1 ? <td class="text-end text-success">Successful</td> : ''}
                                {tr.status === 2 ? <td class="text-end text-warning">Declined</td> : ''}
                              </tr>
                            )}
                             </table>
                          </div>
                      </div>
                  </div>
              </div>				
                    
                          </div>				*/}	
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

export default Wallet;

const style = {
    logo: {width: 45, heiht: 45}
};