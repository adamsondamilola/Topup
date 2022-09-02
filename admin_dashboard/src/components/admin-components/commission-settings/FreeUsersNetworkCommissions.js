import React, { Component, useEffect, useState } from 'react';

import urls from '../../../constants/urls';
import LoadingImage from '../../loadingImage';
import SuccessMessage from '../../../utilities/successMessage';
import ErrorMessage from '../../../utilities/errorMessage';

const FreeUsersNetworkCommissions = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [mtnAirtime, setMtnAirtime] = useState(null);
const [gloAirtime, setGloAirtime] = useState(null);
const [nmobileAirtime, setNmobileAirtime] = useState(null);
const [airtelAirtime, setAirtelAirtime] = useState(null);
const [mtnData, setMtnData] = useState(null);
const [mtnDataShare, setMtnDataShare] = useState(null);
const [gloData, setGloData] = useState(null);
const [nmobileData, setNmobileData] = useState(null);
const [airtelData, setAirtelData] = useState(null);

    const getDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/free-users-commission-details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) 
                {
                    setMtnAirtime(json.vtu_data.mtn_airtime)
                    setGloAirtime(json.vtu_data.glo_airtime)
                    setNmobileAirtime(json.vtu_data.nmobile_airtime)
                    setAirtelAirtime(json.vtu_data.airtel_airtime)
                    setMtnData(json.vtu_data.mtn_data)
                    setMtnDataShare(json.vtu_data.mtn_data_share)
                    setGloData(json.vtu_data.glo_data)
                    setNmobileData(json.vtu_data.nmobile_data)
                    setAirtelData(json.vtu_data.airtel_data)
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
                mtn_airtime: mtnAirtime,
                glo_airtime: gloAirtime,
                nmobile_airtime: nmobileAirtime,
                airtel_airtime: airtelAirtime,
                mtn_data: mtnData,
                mtn_data_share: mtnDataShare,
                glo_data: gloData,
                nmobile_data: nmobileData,
                airtel_data: airtelData,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/free-users-update-network-commission/', postOptions)
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
                        <h4 class="box-title">Update Airtime and Data</h4>
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
                                    <tr>
                                        <th>MTN Data</th>
                                        <td><input className='form-control' value={mtnData} 
                                         onChange={e => setMtnData(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>MTN Data Share</th>
                                        <td><input className='form-control' value={mtnDataShare} 
                                         onChange={e => setMtnDataShare(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Glo Data</th>
                                        <td><input className='form-control' value={gloData} 
                                         onChange={e => setGloData(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>9mobile Data</th>
                                        <td><input className='form-control' value={nmobileData} 
                                         onChange={e => setNmobileData(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Airtel Data</th>
                                        <td><input className='form-control' value={airtelData} 
                                         onChange={e => setAirtelData(e.target.value)} 
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

export default FreeUsersNetworkCommissions;

const style = {
    logo: {width: 45, heiht: 45}
};