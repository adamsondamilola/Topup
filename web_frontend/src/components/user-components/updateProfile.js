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

const UpdateProfile = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState(null);
const [lastName, setLastName] = useState(null);
const [phone, setPhone] = useState(null);


    const copyToClipboard = (text) => {
        const el = text
        window.navigator.clipboard.writeText(text)
        alert("link copied")
      }

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setPhone(json.result.phone)
                    setFirstName(json.result.first_name)
                    setLastName(json.result.last_name)
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
                first_name: firstName,
                last_name: lastName,
                phone: phone,
             })
        };
    
        fetch(urls.apiurl + 'user/update_user_account', postOptions)
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
                        <h4 class="box-title">Update Profile</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                                <tr>
                                        <th>First Name</th>
                                        <td>
                                            <input 
                                    onChange={e => setFirstName(e.target.value)} 
                                    value={firstName}
                                    class="form-control" 
                                    placeholder='Enter First Name'
                                    type="text"/>
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td><input className='form-control' value={lastName} 
                                         onChange={e => setLastName(e.target.value)} 
                                        placeholder='Enter Last Name' /></td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td><input className='form-control' value={phone} 
                                         onChange={e => setPhone(e.target.value)} 
                                        placeholder='Enter Phone' /></td>
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
          <div class="row">
             
              

             
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default UpdateProfile;

const style = {
    logo: {width: 45, heiht: 45}
};