import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link, useParams } from 'react-router-dom';
import LoadingImage from '../loadingImage';

const WithdrawalTransactions = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(100);
    const [bank, setBank] = useState([]);
    
    
   

    const {username} = useParams();
    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result.user)
                    setWallet(json.result.wallet)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const userBankDetails = (usr) => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ usr+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    //setBank(json.result.bank)
                    alert("Account Number: " +json.result.bank.account_number + "\nBank: "+json.result.bank.bank_name + "\nAccount Name: "+json.result.bank.account_name)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const [webSet, setWebSet] = useState([])
    const websiteSettings = () => {    
        getUserDetails();
        fetch(urls.apiurl +'admin/website_settings')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   setWebSet(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }


    const getTransactions = () => {
        setLoading(true)
        const headers = { 'Content-Type': 'application/json' }
        fetch(urls.apiurl +'admin/'+ token+'/100/bank_withdrawal_transactions/', { headers })
//    fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/10/transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.transactions)                    
            }
            
        }).catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }

    const getMoreTransactions = () => {
        setLoading(true)
        setLoadMore(loadMore+10)
        let num = loadMore;
        const headers = { 'Content-Type': 'application/json' }
    fetch(urls.apiurl +'admin/'+ token+'/'+num+'/bank_withdrawal_transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.transactions)                    
            }
            
        }).catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }

    const suspensionBtn = (text, username, id, status) => {
        if(window.confirm('Are you sure you want to '+text+' '+username+' withdrawal request?')){
          fetch(urls.apiurl +'admin/'+ token+'/'+ id+'/'+ status+'/payment_approval/')
          .then((response) => response.json())
          .then((json) => {
              if (json.status == 1) {
                  alert(json.message)
                  getTransactions()
              }else{
                alert(json.message)
              }
          })
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
        }else{
          //
        }
        
    }

    const openUserDetails = (user) => {
        window.location.href = "/admin/"+user+"/user_details";
    }

    useEffect(()=>{
        websiteSettings();
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
                  
                  <div class="row justify-content-center">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Withdrawal Transactions</h4>
                      </div>
                      <div class="box-body pt-0">
                        {isLoading ? <div className='text-center'><LoadingImage/></div> : ''}
                          <div class="table-responsive">
                            <table class="table mb-0">
                            <tr>
                                <td><a href="javascript:void(0)">Type</a></td>
                                <td><span class="text-muted text-nowrap">
                                     Date</span> </td>
                                     <td><span class="text-muted text-nowrap">
                                     User</span> </td>
                                     <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">Amount</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">Bank</span>
                                    </div>
                                </td>
                                <td class="text-end">Status</td>
                                <td class="text-end">Action</td>
                              </tr>
                            {transactions.map(tr =>
                              <tr>
                                <td><a href="#">{tr.type}</a></td>
                                <td><span class="text-muted text-nowrap">
                                {tr.created_at} </span> </td>
                                <td onClick={() => openUserDetails(tr.username)}><span class="text-muted text-nowrap">
                                {tr.username} </span> </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">{NumberToNaira(tr.amount)}</span>
                                    </div>
                                    </td>
                                    <td onClick={()=> userBankDetails(tr.username) }>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5 text-primary">View</span>
                                    </div>
                                    </td>
                                {tr.status === 0 ? <td class="text-end text-danger">Pending</td> : null}
                                {tr.status === 1 ? <td class="text-end text-success">Successful</td> : null}
                                {tr.status === 2 ? <td class="text-end text-warning">Declined</td> : null}

                                {tr.status === 0 ? <td class="text-end text-danger"> <button onClick={() => suspensionBtn("Approve", tr.username, tr.id, 1)} className='btn btn-block btn-success'>Approve</button> </td> : null}
                                {tr.status === 1 ? <td class="text-end text-success"> <button onClick={() => suspensionBtn("Decline", tr.username, tr.id, 2)} className='btn btn-block btn-danger'>Decline</button> </td> : null}
                                {tr.status === 2 ? <td class="text-end text-warning"> <button onClick={() => suspensionBtn("Re-Approve", tr.username, tr.id, 1)} className='btn btn-block btn-warning'>Re-Approve</button> </td> : null}

                              </tr>
                            )}
                             </table>
                          </div>
                          <div className='row justify-content-center mt-5'>
                          <button onClick={() => getMoreTransactions() } className='btn btn-primary btn-block'>Load More</button>
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

export default WithdrawalTransactions;

const style = {
    logo: {width: 45, heiht: 45}
};