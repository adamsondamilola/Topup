import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urls from '../../constants/urls';
import ErrorMessage from '../../utilities/errorMessage';
import SuccessMessage from '../../utilities/successMessage';
import LoadingImage from '../loadingImage';
const LoginForm = () => {

    const [password, setPassword] = useState(null);
    const [emailUsername, setEmailUsername] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false)
    const [userData, setUserData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const copyToClipboard = (text) => {
        const el = text
        window.navigator.clipboard.writeText(text)
        alert("link copied")
      }

      const onLoginEnter = (event) =>{
        if(event.keyCode === 13){
            loginAction()
        }
              }

      useEffect(()=>{
localStorage.removeItem('loginToken');
fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    window.location.replace("/user/dashboard");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

      },[])

    const loginAction = () =>{
        localStorage.removeItem('loginToken')
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                    email: emailUsername,
                    password: password,
             })
        };
    
        fetch(urls.apiurl + 'auth/login', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            localStorage.setItem('loginToken', json.login_token);
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

        return <div class="container bg-white">
        <div class="row justify-content-center text-center d-flex">
            
            <div class="col-lg-6">
                <div class="user-form-content">

             
                    {successMsg == null ?
                        <div class="row">

                            <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>Username or Email</label>
                                    <input class="form-control" 
                                    type="email" 
                                    value={emailUsername}
                                    onChange={e => setEmailUsername(e.target.value)}/>
                                </div>
                            </div>

                            <div class="col-12 mt-3">
                                <div class="form-group">
                                    <label>Password</label>
                                    <input class="form-control" 
                                    type="password" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => onLoginEnter(e)}/>
                                </div>                                
                            </div>
                            
                            {errMsg != null? <ErrorMessage message={errMsg}/> : null  }

                            <div class="col-12 mt-3">                            
                                {isLoading? <LoadingImage /> :
                                <button class="default-btn register" onClick={() => loginAction()} type="button">
                                Log In
                            </button>
                            }
                            </div>

                            <div class="col-12 m-5">
                                <p class="create">Forgot password? 
                                <Link to="/forgotpassword"> Click here </Link></p>
                            </div>
                            <div class="col-12 m-5">
                                <p class="create">Need new account? 
                                <Link to="/register"> Click here </Link></p>
                            </div>
                        </div>
                       :
                       null }
                    </div>
                    
            </div>
            <div class="col-lg-12">

            </div>
        </div>
    </div>;
      }

      export default LoginForm;