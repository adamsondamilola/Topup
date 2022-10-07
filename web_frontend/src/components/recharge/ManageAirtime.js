import React, { Component, useEffect, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import { Link } from 'react-router-dom';
import Mask from '../../utilities/MaskCardNumber';
import urls from '../../constants/urls';

const ManageAirtime = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactions, setTransactions] = useState([]);
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
    fetch(urls.apiurl +'admin/'+ token+'/20/airtime_pins', { headers })
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
    fetch(urls.apiurl +'admin/'+ token+'/'+search+'/search_airtime_pins', { headers })
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
        fetch(urls.apiurl +'admin/'+ token+'/'+num+'/admin_airtime_pins', { headers })
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
                            placeholder="Search Airtime" 
                            value={search} />
                            {isLoading? <i className='fa fa-loading'></i> 
                            : <button onClick={()=>{searchTransactions(search)}} class="btn btn-primary btn-sm"> Search </button>
                            }
                            </div>

                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Manage Airtime <Link to="/user/add_airtime" className='btn btn-primary'> + </Link> </h4>
                      </div>
                      <div class="box-body pt-0">
                          <div class="table-responsive">
                            <table class="table mb-0">
                            <tr>
                            <td>Network</td>
                            <td>Amount</td>
                            <td>PIN</td>
                            <td>S/N</td>
                            <td>Creator</td>
                            <td>Used by</td>
                                <td>Status</td>
                                <td>Date </td>
                              </tr>
                              <tbody>
                            {transactions.map(tr =>
                              <tr>
                                <td>{tr.network}</td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(tr.amount)}</span>
                                </td>
                                <td>{Mask(tr.pin)}</td>
                                <td>{Mask(tr.serial_number)}</td>
                                <td>{tr.created_by}</td>
                                <td>{tr.purchased_by}</td>
                                {tr.status === 0 ? <td class="text-end text-danger">Bought</td> : ''}
                                {tr.status === 1 ? <td class="text-end text-success">Available</td> : ''}
                                <td> {tr.created_at}  </td>
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

export default ManageAirtime;

const style = {
    logo: {width: 45, heiht: 45}
};