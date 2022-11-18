import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../../constants/urls';
import ErrorMessage from '../../utilities/errorMessage';
import SuccessMessage from '../../utilities/successMessage';
import LoadingImage from '../loadingImage';
const ForgotPasswordForm = () => {

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
    
        fetch(urls.apiurl + 'auth/confirm_password_reset', postOptions)
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

    
    return <div class="container card">
        <div class=" justify-content-center text-center d-flex">
          
                        <div class="row">

                        <div class="col-md-12 mt-3">
                        <div class="text-center section_title">
			<p class="sec_small_title text-custom font-weight-bold mb-1">Forgot Password</p>
			<h3 class="font-weight-bold mb-0">Reset your password</h3>
			<div class="section_title_border">
			<div class="f-border"></div>
			<div class="f-border"></div>
			<div class="s-border"></div>
			<div class="f-border"></div>
			<div class="f-border"></div>
			</div>
            </div>
                        </div>
                            {requestState ? 
                            <>
                            <SuccessMessage message={successMsg}/>
                             <div class="col-md-12 mt-3">
                                <div class="form-group">
                                    <label>Code</label>
                                    <input class="form-control" type="email"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}/>
                                </div>
                            </div>

                            <div class="col-md-6 mt-3">
                                <div class="form-group">
                                    <label>Password</label>
                                    <input class="form-control" 
                                    type="password"
                                    onChange={e => setPassword(e.target.value)} 
                                    value={password}/>
                                </div>                                
                            </div>

                            <div class="col-md-6 mt-3">
                                <div class="form-group">
                                    <label>Confirm Password</label>
                                    <input 
                                    class="form-control" 
                                    type="password" 
                                    onChange={e => setPassword2(e.target.value)} 
                                    value={password2}/>
                                </div>                                
                            </div>

                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                            <div class="col-md-12 mt-3">                            
                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-success btn-block" onClick={() => confirmRequestReset()} type="button">
                                Confirm Password Reset
                            </button>
                            }
                            </div>                            
                            </>

                            :
                            
                            <>
                            <div class="col-md-12 mt-3">
                                <div class="form-group">
                                    <label>Username or Email</label>
                                    <input class="form-control" type="email"
                                    value={emailUsername}
                                    onChange={e => setEmailUsername(e.target.value)}/>
                                </div>
                            </div>
                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                            <div class="col-md-12 mt-3">                            
                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-success btn-block" onClick={() => requestReset()} type="button">
                                Reset Password
                            </button>
                            }
                            </div>                             
                            </>
                            
                            }

                            <div class="col-12"><br/><br/><br/>
                                <p class="create">Remembered password? 
                                <Link to="/login"> Login </Link></p>
                            </div>
                        </div>
        </div>
    </div>
      }

      export default  ForgotPasswordForm; 