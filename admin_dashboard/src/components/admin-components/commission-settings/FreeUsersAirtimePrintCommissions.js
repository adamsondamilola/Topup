import React, { Component, useEffect, useState } from 'react';

import urls from '../../../constants/urls';
import LoadingImage from '../../loadingImage';
import SuccessMessage from '../../../utilities/successMessage';
import ErrorMessage from '../../../utilities/errorMessage';

const FreeUsersAirtimePrintCommissions = () => {
   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [mtnAirtime, setMtnAirtime] = useState(null);
const [gloAirtime, setGloAirtime] = useState(null);
const [nmobileAirtime, setNmobileAirtime] = useState(null);
const [airtelAirtime, setAirtelAirtime] = useState(null);

    const getDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/free-users-commission-details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) 
                {
                    setMtnAirtime(json.airtime_print_com.mtn)
                    setGloAirtime(json.airtime_print_com.glo)
                    setNmobileAirtime(json.airtime_print_com.nmobile)
                    setAirtelAirtime(json.airtime_print_com.airtel)
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
                mtn: mtnAirtime,
                glo: gloAirtime,
                nmobile: nmobileAirtime,
                airtel: airtelAirtime,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/free-users-update-airtime-print-commission/', postOptions)
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
                        <h4 class="box-title">Update Airtime Print Commission</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>MTN Airtime</th>
                                        <td>
                                            <input 
                                    onChange={e => setMtnAirtime(e.target.value)} 
                                    value={mtnAirtime}
                                    class="form-control" 
                                    type="text" />
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Glo Airtime</th>
                                        <td><input className='form-control' value={gloAirtime} 
                                         onChange={e => setGloAirtime(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>9mobile Airtime</th>
                                        <td><input className='form-control' value={nmobileAirtime} 
                                         onChange={e => setNmobileAirtime(e.target.value)} 
                                        /></td>
                                    </tr>
                                    <tr>
                                        <th>Airtel Airtime</th>
                                        <td><input className='form-control' value={airtelAirtime} 
                                         onChange={e => setAirtelAirtime(e.target.value)} 
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

export default FreeUsersAirtimePrintCommissions;

const style = {
    logo: {width: 45, heiht: 45}
};