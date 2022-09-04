import React, { Component, useEffect, useState } from 'react';

import urls from '../../constants/urls';
import ErrorMessage from '../../utilities/errorMessage';
import SuccessMessage from '../../utilities/successMessage';
import LoadingImage from '../loadingImage';

const CreatePin = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);

    const createPinAction = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                password: password,
                password2: password2,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'auth/create_pin', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setSuccessMsg(json.message)
                            window.location.replace("/user/dashboard");
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

   const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setWallet(json.result.wallet)
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
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Create PIN</h4>
                         </div>
                      <div class="box-body">
                          
                          
                           {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }


          <div class="col-xl-12 col-lg-12">
<div class="box">
<div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>New PIN</label>
                                    <input class="form-control"
                                    maxLength={4} 
                                    type="password"
                                    onChange={e => setPassword(e.target.value)} 
                                    value={password}/>
                                </div>                                
                            </div>

                            <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>Confirm PIN</label>
                                    <input 
                                    maxLength={4}
                                    class="form-control" 
                                    type="password" 
                                    onChange={e => setPassword2(e.target.value)} 
                                    value={password2}/>
                                </div>                                
                            </div>

                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                            <div class="col-12 text-center m-5">                            
                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-primary" onClick={() => createPinAction()} type="button">
                                Set PIN
                            </button>
                            }
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

export default CreatePin;

const style = {
    logo: {width: 45, heiht: 45}
};