import React, { Component, useEffect, useState } from 'react';

import urls from '../../constants/urls';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const AddApi = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [apiProvider, setApiProvider] = useState(null);
const [publicKey, setPublicKey] = useState(null);
const [apiSecretKey, setApiSecretKey] = useState(null);
const [contractCode, setContractCode] = useState(null);
const [endPoint, setEndPoint] = useState(null);


    const addApiAction = () =>{
        setErrMsg(null)
        setLoading(true)
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                api_provider: apiProvider,
                public_key: publicKey,
                api_secret_key: apiSecretKey,
                contract_code: contractCode,
                end_point: endPoint,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/add-api', postOptions)
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
                        <h4 class="box-title">Add Api</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>Provider</th>
                                        <td>
                                            <input 
                                    onChange={e => setApiProvider(e.target.value)} 
                                    value={apiProvider}
                                    class="form-control" 
                                    type="text" />
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Public Key</th>
                                        <td><input className='form-control' value={publicKey} 
                                         onChange={e => setPublicKey(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Secret Key</th>
                                        <td><input className='form-control' value={apiSecretKey} 
                                         onChange={e => setApiSecretKey(e.target.value)} 
                                        /></td>
                                    </tr>
                                    <tr>
                                        <th>Contract Code</th>
                                        <td><input className='form-control' value={contractCode} 
                                         onChange={e => setContractCode(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>End Point</th>
                                        <td><input className='form-control' value={endPoint} 
                                         onChange={e => setEndPoint(e.target.value)} 
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
                                <button class="btn btn-primary" onClick={() => addApiAction()} type="button">
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

export default AddApi;

const style = {
    logo: {width: 45, heiht: 45}
};