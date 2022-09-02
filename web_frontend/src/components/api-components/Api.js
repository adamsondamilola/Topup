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

const Api = () => {

   
    const [userData, setUserData] = useState([]);
    const [userApi, setUserApi] = useState(null);
    const [amount, setAmount] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [pin, setPin] = useState(null);
    const [enterPin, setEnterPin] = useState(false);
    const [done, setDone] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    let amt = amount
   
    const copyToClipboard = (text) => {
        const el = text
        window.navigator.clipboard.writeText(text)
        alert("Copied!")
      }

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

    const getReceiver = () => {
        setErrMsg(null)
        setSuccessMsg(null)
        if(receiver == null || amount == null){
            setErrMsg("No field should be left empty")
        }else if(amount < 1){
            setErrMsg("Please, try again")
        }else{
            setEnterPin(true)
        }
    }


    const getUserApi = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_api/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserApi(json.api)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }


    const createApiAction = () =>{
        setErrMsg(null)
        setSuccessMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                login_token: token,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'user/create_api', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setDone(true)
                            getUserApi();
                           setSuccessMsg(json.message);

                }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                            setEnterPin(false)
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
        getUserApi();
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
                        <h4 class="box-title">Api</h4>
                      </div>
                      <div class="box-body pt-0">

                      <div class="col-xl-12 col-12">
                  {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
              </div>

              <div class="box-body pt-0 mt-5">
              <div style={{display: userApi==null? `none` : `block`}} class="col-12 mt-3"> 
                      <div class="input-group mb-3">
                                    <button onClick={() => copyToClipboard(userApi)} class="btn btn-primary" readOnly style={{width:80, fontSize: 15}}>COPY</button>
                                    <input class="form-control"
                                    type="text" 
                                    value={userApi}/>
                                    </div>
                        </div>

                      
                                    <div class="col-12 mt-3">   

                          {isLoading? <LoadingImage /> :
                          <button class="btn btn-primary" onClick={() => createApiAction()} type="button">
                          Create New API
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
          <div class="row">
             
              

             
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default Api;

const style = {
    logo: {width: 45, heiht: 45}
};