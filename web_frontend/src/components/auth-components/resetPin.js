import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../../constants/urls';
import ErrorMessage from '../../utilities/errorMessage';
import SuccessMessage from '../../utilities/successMessage';
import LoadingImage from '../loadingImage';
const ResetPin = () => {

    const [code, setCode] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
    const [emailUsername, setEmailUsername] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false)
    const [requestState, setRequestState] = useState(false)

    const requestReset = () =>{
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                    email: emailUsername,
             })
        };
    
        fetch(urls.apiurl + 'auth/password_reset', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setRequestState(true)
                           setSuccessMsg(json.message)
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }    
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

    const confirmRequestReset = () =>{
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                code: code,
                password: password,
                password2: password2,
            })
        };
    
        fetch(urls.apiurl + 'auth/confirm_pin_reset', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setRequestState(true)
                            window.location.replace("/login")
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }    
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [userData, setUserData] = useState([]);
    const getUserDetails = () => {
        if(token !== null){
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                    setUserData(json.result)
                    setEmailUsername(json.result.email)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
        }
    }

    useEffect(()=>{
        getUserDetails();
    },[])

    
    return <div class="wrapper">
    <div class="content-wrapper">
<div class="container-full">
  <section class="content">
       <div class="row">
          <div class="col-xl-12 col-12">
              
              <div class="row">					
            				
              <div class="col-lg-6">
                <div class="user-form-content">

                        <div class="row">

                            {requestState ? 
                            <>
                            <SuccessMessage message={successMsg}/>
                             <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>Code</label>
                                    <input class="form-control" type="email"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}/>
                                </div>
                            </div>

                            <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>PIN</label>
                                    <input class="form-control" 
                                    type="password"
                                    onChange={e => setPassword(e.target.value)} 
                                    value={password}/>
                                </div>                                
                            </div>

                            <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>Confirm PIN</label>
                                    <input 
                                    class="form-control" 
                                    type="password" 
                                    onChange={e => setPassword2(e.target.value)} 
                                    value={password2}/>
                                </div>                                
                            </div>

                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                            <div class="col-12 mt-3">                            
                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-primary" onClick={() => confirmRequestReset()} type="button">
                                Confirm PIN Reset
                            </button>
                            }
                            </div>                            
                            </>

                            :
                            
                            <>
                            <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input class="form-control" type="email"
                                    value={userData.email} readOnly/>
                                </div>
                            </div>
                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                            <div class="col-12 mt-3">                            
                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-primary" onClick={() => requestReset()} type="button">
                                Reset PIN
                            </button>
                            }
                            </div>                             
                            </>
                            
                            }

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

      export default  ResetPin; 