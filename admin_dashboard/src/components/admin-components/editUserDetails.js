import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { useParams } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const EditUserDetails = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg2, setSuccessMsg2] = useState(null);
    const [errMsg2, setErrMsg2] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState(null);
const [lastName, setLastName] = useState(null);
const [phone, setPhone] = useState(null);

const [mainWallet, setMainWallet] = useState(null);
const [referralBalalnce, setReferralBalalnce] = useState(null);
const [totalBalance, setTotalBalance] = useState(null);
const [points, setPoints] = useState(null);
const [cashBackBalance, setCashBackBalance] = useState(null);
const [cashBackWithdrawn, setCashBackWithdrawn] = useState(null);
const [referralWithdrawn, setReferralWithdrawn] = useState(null);

const {username} = useParams();
const [userData, setUserData] = useState([]);
const [email, setEmail] = useState(null);

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result.user)
                    setPhone(json.result.user.phone)
                    setEmail(json.result.user.email)
                    setFirstName(json.result.user.first_name)
                    setLastName(json.result.user.last_name)
                   // setWallet(json.result.wallet)
                   setMainWallet(json.result.wallet.main_wallet)
                   setReferralBalalnce(json.result.wallet.referral_balance)
                   setTotalBalance(json.result.wallet.total_balance)
                   setPoints(json.result.wallet.points)
                   setCashBackBalance(json.result.wallet.cashback_balance)
                   setCashBackWithdrawn(json.result.wallet.cashback_withdrawn)
                   setReferralWithdrawn(json.result.wallet.referral_withdrawn)
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
                username: userData.username,
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/update_user_profile', postOptions)
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



    const updateWalletAction = () =>{
        setErrMsg2(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: userData.username,
                total_balance: totalBalance,
                main_wallet: mainWallet,
                points: points,
                referral_balance: referralBalalnce,
                cashback_balance: cashBackBalance,
                referral_withdrawn: referralWithdrawn,
                cashback_withdrawn: cashBackWithdrawn,
                token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/update_user_wallet', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg2(null)
                            setLoading(false)
                           setSuccessMsg2(json.message);
                }
                        else {
                            setErrMsg2(json.message)
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
                                    <tr>
                                        <th>Email</th>
                                        <td><input className='form-control' value={email} 
                                         onChange={e => setEmail(e.target.value)} 
                                        placeholder='Enter Email' /></td>
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
                                Update Profile
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

export default EditUserDetails;

const style = {
    logo: {width: 45, heiht: 45}
};