import React, { Component, useEffect, useState } from 'react';

import urls from '../../../constants/urls';
import LoadingImage from '../../loadingImage';
import SuccessMessage from '../../../utilities/successMessage';
import ErrorMessage from '../../../utilities/errorMessage';

const FreeUsersElectricityCommissions = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [commission, setCommission] = useState(null);

    const getDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/free-users-commission-details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) 
                {
                    setCommission(json.electric_com.commission)
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
                commission: commission,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/free-users-update-electricity-commission/', postOptions)
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
                        <h4 class="box-title">Update Electricity Commission</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>Commission</th>
                                        <td>
                                            <input 
                                    onChange={e => setCommission(e.target.value)} 
                                    value={commission}
                                    class="form-control" 
                                    type="text" />
                                    </td>
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

export default FreeUsersElectricityCommissions;

const style = {
    logo: {width: 45, heiht: 45}
};