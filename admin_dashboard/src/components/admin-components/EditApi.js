import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { useParams } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const EditApi = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [apiProvider, setApiProvider] = useState(null);
const [publicKey, setPublicKey] = useState(null);
const [apiSecretKey, setApiSecretKey] = useState(null);
const [contractCode, setContractCode] = useState(null);
const [endPoint, setEndPoint] = useState(null);

const {id} = useParams();
const [userData, setUserData] = useState([]);
const [email, setEmail] = useState(null);

    const getApiDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ id+'/api-details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) 
                {
                    setApiProvider(json.result.api_provider)
                    setPublicKey(json.result.public_key)
                    setApiSecretKey(json.result.api_secret_key)
                    setContractCode(json.result.contract_code)
                    setEndPoint(json.result.end_point)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }


    const updateAction = () =>{
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
    
        fetch(urls.apiurl + 'admin/'+id+'/update-api', postOptions)
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

    const deleteAction = () => {
        if(window.confirm('Are you sure you want to delete API?')){
          fetch(urls.apiurl +'admin/'+ token+'/'+ id+'/delete-api-details/')
          .then((response) => response.json())
          .then((json) => {
              if (json.status == 1) {
                  alert(json.message)
                  window.location.replace('/admin/api_keys')
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

    useEffect(()=>{
        getApiDetails();
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
                        <h4 class="box-title">Update Api</h4>
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
                                    type="text" readOnly/>
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
                                <button class="btn btn-primary" onClick={() => updateAction()} type="button">
                                Update 
                            </button>
                            }
                            </div>

                            <button class="btn btn-danger btn-block mt-5 " onClick={() => deleteAction()} type="button">
                                Delete 
                            </button>

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

export default EditApi;

const style = {
    logo: {width: 45, heiht: 45}
};