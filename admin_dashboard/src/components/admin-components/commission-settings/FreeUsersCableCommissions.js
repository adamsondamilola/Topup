import React, { Component, useEffect, useState } from 'react';

import urls from '../../../constants/urls';
import LoadingImage from '../../loadingImage';
import SuccessMessage from '../../../utilities/successMessage';
import ErrorMessage from '../../../utilities/errorMessage';

const FreeUsersCableCommissions = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [gotv, setGotv] = useState(null);
const [dstv, setDstv] = useState(null);
const [startimes, setStartimes] = useState(null);

    const getDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/free-users-commission-details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) 
                {
                    setDstv(json.cable_com.dstv)
                    setGotv(json.cable_com.gotv)
                    setStartimes(json.cable_com.startimes)
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
                dstv: dstv,
                gotv: gotv,
                startimes: startimes,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/free-users-update-cable-commission/', postOptions)
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
        getDetails();
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
                        <h4 class="box-title">Update Cable Commission</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>GOTV</th>
                                        <td>
                                            <input 
                                    onChange={e => setGotv(e.target.value)} 
                                    value={gotv}
                                    class="form-control" 
                                    type="text" />
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>DSTV</th>
                                        <td><input className='form-control' value={dstv} 
                                         onChange={e => setDstv(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Startimes</th>
                                        <td><input className='form-control' value={startimes} 
                                         onChange={e => setStartimes(e.target.value)} 
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

export default FreeUsersCableCommissions;

const style = {
    logo: {width: 45, heiht: 45}
};