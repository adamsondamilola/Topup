import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';

const Transactions = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);
   

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                    setUserData(json.result)
                    setWallet(json.result.wallet)
                }else{
                    window.location.replace("/login");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getTransactions = () => {
        setLoading(true)
        const headers = { 'Content-Type': 'application/json' }
    fetch(urls.apiurl +'transaction/'+ token+'/50/transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.result)                    
            }
        });
/*
        fetch(urls.apiurl +'transaction/'+ token+'/50/transactions')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                    setTransactions(json.result)                    
                }
            })
            .catch((error) => console.error("Goterr "+error))
            .finally(() => setLoading(false));
            */
    }

    useEffect(()=>{
        getUserDetails();
        if(token === null){
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
                  
                  <div class="row">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Transactions</h4>
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
                                {tr.status === 0 ? <td class="text-end text-danger">Pending</td> : null}
                                {tr.status === 1 ? <td class="text-end text-success">Successful</td> : null}
                                {tr.status === 2 ? <td class="text-end text-warning">Declined</td> : null}
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

export default Transactions;

const style = {
    logo: {width: 45, heiht: 45}
};