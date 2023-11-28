import React, { Component, useEffect, useState } from 'react';

import urls from '../../constants/urls';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const AddDataPrices = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [network, setNetwork] = useState(null);
const [dataDescription, setDataDescription] = useState(null);
const [days, setDays] = useState(null);
const [dataAmount, setDataAmount] = useState(null);
const [dataType, setDataType] = useState(null);
const [dataCode, setDataCode] = useState(null);


    const addAction = () =>{
        setErrMsg(null)
        setLoading(true)
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: network,
                data_description: dataDescription,
                days: days,
                data_amount: dataAmount,
                data_type: dataType,
                data_code: dataCode,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/add-data-price', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                           setSuccessMsg(json.message);
                }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }    
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }


    useEffect(()=>{
        if(token == null){
            window.location.replace("/login");
        }
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
                        <h4 class="box-title">Add Data</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>Network</th>
                                        <td>
                                            <input 
                                    onChange={e => setNetwork(e.target.value)} 
                                    value={network}
                                    class="form-control" 
                                    type="text" />
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Description</th> 
                                        <td><input className='form-control' value={dataDescription} 
                                         onChange={e => setDataDescription(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Days</th>
                                        <td><input className='form-control' value={days} 
                                         onChange={e => setDays(e.target.value)} 
                                        /></td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td><input className='form-control' value={dataAmount} 
                                         onChange={e => setDataAmount(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Type</th>
                                        <td><input className='form-control' value={dataType} 
                                         onChange={e => setDataType(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Code</th>
                                        <td><input className='form-control' value={dataCode} 
                                         onChange={e => setDataCode(e.target.value)} 
                                         /></td>
                                    </tr>
                                </tbody>
                                </table>
                                <div class="col-12 mt-3">  

                                 <div class="col-xl-12 col-12">
                  {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
              </div>

                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-primary" onClick={() => addAction()} type="button">
                                Add New 
                            </button>
                            }
                            </div>

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

export default AddDataPrices;

const style = {
    logo: {width: 45, heiht: 45}
};