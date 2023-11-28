import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const UpdatePIN = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [password, setPassword] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);
   
    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
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
                login_token: token,
                password: password,
                password1: password1,
                password2: password2,
             })
        };
    
        fetch(urls.apiurl + 'auth/update_pin', postOptions)
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
        getUserDetails();
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
                        <h4 class="box-title">Update PIN</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                                <tr>
                                        <th>Current PIN</th>
                                        <td>
                                            <input 
                                    onChange={e => setPassword(e.target.value)} 
                                    value={password} maxLength={4}
                                    class="form-control" 
                                    type="password"/>
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>New PIN</th>
                                        <td><input className='form-control' 
                                        type='password'
                                        maxLength={4} value={password1} 
                                         onChange={e => setPassword1(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Confirm PIN</th>
                                        <td><input className='form-control'
                                        type='password'
                                         maxLength={4} value={password2} 
                                         onChange={e => setPassword2(e.target.value)} 
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

                            <div class="col-12 mt-5">
                                <p class="create">Forgot PIN? 
                                <Link to="/user/forgotpin"> Click here </Link></p>
                            </div>

                            </div>
                                </div>
                         </div>
                  </div>
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

export default UpdatePIN;

const style = {
    logo: {width: 45, heiht: 45}
};