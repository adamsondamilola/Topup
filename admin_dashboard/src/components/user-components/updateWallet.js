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

const EditWallet = () => {

   
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
const [wallet, setWallet] = useState([]);

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result.user)
                    setPhone(json.result.user.phone)
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
                        <h4 class="box-title">Update Wallet</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                                <tr>
                                        <th>Main Wallet</th>
                                        <td>
                                            <input 
                                    onChange={e => setMainWallet(e.target.value)} 
                                    value={mainWallet}
                                    class="form-control" 
                                    type="text"/>
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Referral Balance</th>
                                        <td><input className='form-control' value={referralBalalnce} 
                                         onChange={e => setReferralBalalnce(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Referral Withdrawn</th>
                                        <td><input className='form-control' value={referralWithdrawn} 
                                         onChange={e => setReferralWithdrawn(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Points</th>
                                        <td><input className='form-control' value={points} 
                                         onChange={e => setPoints(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Cash-back Balance</th>
                                        <td><input className='form-control' value={cashBackBalance} 
                                         onChange={e => setCashBackBalance(e.target.value)} 
                                         />
                                         </td>
                                    </tr>
                                    <tr>
                                        <th>Cash-back Withdrawn</th>
                                        <td><input className='form-control' value={cashBackWithdrawn} 
                                         onChange={e => setCashBackWithdrawn(e.target.value)} 
                                         />
                                         </td>
                                    </tr>
                                    <tr>
                                        <th>Total Balance</th>
                                        <td><input className='form-control' value={totalBalance} 
                                         onChange={e => setTotalBalance(e.target.value)} 
                                         /></td>
                                    </tr>
                                </tbody>
                                </table>
                                <div class="col-12 mt-3">  

                                 <div class="col-xl-12 col-12">
                  {successMsg2 != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg2}/>
              </div>
              </div>
               : null  }

{errMsg2 != null? <ErrorMessage message={errMsg2}/> : null  }
              </div>

                                {isLoading? <LoadingImage /> :
                                <button class="btn btn-primary" onClick={() => updateWalletAction()} type="button">
                                Update Wallet
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

export default EditWallet;

const style = {
    logo: {width: 45, heiht: 45}
};