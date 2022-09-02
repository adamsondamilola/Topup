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
    const [transactionDetails, setTransactionDetails] = useState([]);
    const [search, setSearch] = useState([]);
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
    fetch(urls.apiurl +'transaction/'+ token+'/20/transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.result)                    
            }
        });

    }


    const searchOnEnter = (event) => {
        if (event.key === 'Enter') {
            searchTransactions(search)
          }
    }
    

    const searchTransactions = (search) => {
        setLoading(true)
        const headers = { 'Content-Type': 'application/json' }
    fetch(urls.apiurl +'transaction/'+ token+'/'+search+'/search_transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.result)                    
            }
        }).catch((error) => console.error(error))
        .finally(() => setLoading(false));;
    }

    const [loadMore, setLoadMore] = useState(20);
    const getMoreTransactions = () => {
        setLoading(true)
        setLoadMore(loadMore+10)
        let num = loadMore;
        const headers = { 'Content-Type': 'application/json' }
    fetch(urls.apiurl +'transaction/'+ token+'/'+num+'/transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.result)                    
            }
            
        }).catch((error) => console.error(error))
        .finally(() => setLoading(false));
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

                  <div class="input-group mb-3">
                            <input class="form-control" type="text" 
                             onChange={e => setSearch(e.target.value)} onKeyDown={()=>searchOnEnter()}
                            placeholder="Search Transaction" 
                            value={search} />
                            {isLoading? <i className='fa fa-loading'></i> 
                            : <button onClick={()=>{searchTransactions(search)}} class="btn btn-primary btn-sm"> Search </button>
                            }
                            </div>

                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Transactions</h4>
                      </div>
                      <div class="box-body pt-0">
                          <div class="table-responsive">
                            <table class="table mb-0">
                            <tr>
                                <td><a href="javascript:void(0)">Type</a></td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">Amount</span>
                                    </div>
                                </td>
                                <td class="text-end">Status</td>
                                <td><span class="text-muted text-nowrap">
                                     Date</span> </td>
                              </tr>
                              <tbody>
                            {transactions.map(tr =>
                              <tr>
                                <td><Link to={"/user/"+tr.id+"/view_transactions"}>{tr.type}</Link></td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">{NumberToNaira(tr.amount)}</span>
                                    </div>
                                </td>
                                {tr.status === 0 ? <td class="text-end text-danger">Pending</td> : null}
                                {tr.status === 1 ? <td class="text-end text-success">Successful</td> : null}
                                {tr.status === 2 ? <td class="text-end text-warning">Declined</td> : null}
                                <td><span class="text-muted text-nowrap">
                                {tr.created_at} </span> </td>
                        </tr>
                            )}
                            </tbody>
                             </table>
                          </div>
                      </div>
                  </div>
              </div>				
                    
              <div class="row">
                          <button onClick={() => getMoreTransactions() } className='btn btn-primary btn-block'>Load More</button>
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