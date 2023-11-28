import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link, useParams } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const Transfer = () => {

    const {username} = useParams();
    const [userData, setUserData] = useState([]);
    const [amount, setAmount] = useState(null);
    const [receiver, setReceiver] = useState(username);
    const [pin, setPin] = useState(null);
    const [enterPin, setEnterPin] = useState(false);
    const [done, setDone] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    let amt = amount
   
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

    const transferAction = () =>{
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
                sender: userData.username,
                receiver: receiver,
                amount: amount,
                pin: pin
             })
        };
    
        fetch(urls.apiurl + 'admin/'+username+'/transfer', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setDone(true)
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
                        <h4 class="box-title">Transfer</h4>
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

                      {!enterPin ? 
                      
                      <div class="table-responsive">
                      <table class="table mb-0 table-striped">
                          <tbody>
                          <tr>
                                  <th>Receiver</th>
                                  <td>
                                      <input 
                              onChange={e => setReceiver(e.target.value)} 
                              value={receiver} 
                              class="form-control" 
                              placeholder='Email or Username'
                              type="text" readOnly/>
                              </td>
                              </tr>
                              <tr>
                                  <th>Amount</th>
                                  <td><input className='form-control' 
                                  type='tel'
                                  placeholder='Enter Amount'
                                   onChange={e => setAmount(e.target.value)} 
                                   value={amount} 
                                   /></td>
                              </tr>
                          </tbody>
                          </table>
                          <div class="col-12 mt-3">   

                          {isLoading? <LoadingImage /> :
                          <button class="btn btn-primary" onClick={() => getReceiver()} type="button">
                          Proceed
                      </button>
                      }
                      </div>
                          </div>
                          
                        : null}


{enterPin && !done ?
    <div class="col-12 mt-3">   
<p>You are about to transfer {NumberToNaira(parseFloat(amount))} to {receiver}. Enter your PIN below and confirm to complete transaction. </p>
<div class="col-12 mt-3">   
<div class="input-group mb-3">
                                    <input class="form-control text-dark"
                                    type="password" 
                                    placeholder='Enter PIN'
                                    maxLength={4}
                                    onChange={e => setPin(e.target.value)} 
                                   value={pin}/>
                                    {isLoading? <LoadingImage /> :
<button class="btn btn-primary" onClick={() => transferAction()} type="button">
Confirm
</button>
}
                                    </div>
</div>
</div>

: null }


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

export default Transfer;

const style = {
    logo: {width: 45, heiht: 45}
};