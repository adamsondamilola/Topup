import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const Commission = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingPackage, setPendingPackage] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [enterCoupon, setEnterCoupon] = useState(false);

    const [coupon, setCoupon] = useState(null);


    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setWallet(json.wallet[0])
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
                if (json.status == 1) {
                    setTransactions(json.result)
                    //console.log("dataa"+ transactions)
                }
            })
            .catch((error) => console.error("Goterr "+error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        getUserDetails();
        if(token == null){
            window.location.replace("/login");
        }
        getTransactions();
    },[])

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                       <div class="box-body">
                          <div class="row mb-20">
                                 <div class="row">
                                  
     
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
                                {tr.status == 0 ? <td class="text-end text-danger">Pending</td> : null}
                                {tr.status == 1 ? <td class="text-end text-success">Successful</td> : null}
                                {tr.status == 2 ? <td class="text-end text-warning">Declined</td> : null}
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

export default Commission;

const style = {
    logo: {width: 45, heiht: 45}
};