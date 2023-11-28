import React, { Component, useEffect, useState } from 'react';

import urls from '../../constants/urls';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const AddCablePrices = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [serviceId, setServiceId] = useState(null);
const [serviceCode, setServiceCode] = useState(null);
const [serviceAmount, setServiceAmount] = useState(null);
const [serviceDescription, setServiceDescription] = useState(null);


    const addAction = () =>{
        setErrMsg(null)
        setLoading(true)
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                serviceID: serviceId,
                service_code: serviceCode,
                service_amount: serviceAmount,
                service_description: serviceDescription,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/add-cable-price', postOptions)
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
                        <h4 class="box-title">Add Cable</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>Service </th>
                                        <td>
                                            <input 
                                    onChange={e => setServiceId(e.target.value)} 
                                    value={serviceId}
                                    class="form-control" 
                                    type="text" />
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Code</th> 
                                        <td><input className='form-control' value={serviceCode} 
                                         onChange={e => setServiceCode(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td><input className='form-control' value={serviceAmount} 
                                         onChange={e => setServiceAmount(e.target.value)} 
                                        /></td>
                                    </tr>
                                    <tr>
                                        <th>Description</th>
                                        <td><input className='form-control' value={serviceDescription} 
                                         onChange={e => setServiceDescription(e.target.value)} 
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

export default AddCablePrices;

const style = {
    logo: {width: 45, heiht: 45}
};