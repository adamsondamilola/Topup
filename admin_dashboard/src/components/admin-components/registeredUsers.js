import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import FormatNumber from '../../constants/formatNumber';

const RegisteredUsers = () => {

    const [transactions, setTransactions] = useState([]);
    
    const [userData, setUserData] = useState([]);
    const [usersDataList, setUsersDataList] = useState([]);
    const [referrals, setReferrals] = useState(0);
    const [referralsList, setReferralsList] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [amount, setAmount] = useState(100);
    const [numberOfCard, setNumberOfCard] = useState(1);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    
    const CreatePin = () => {
        setErrMsg(null)
        setSuccessMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                amount: amount,
            numbers: numberOfCard,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'admin/create_wallet_pin', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            getCiuponCodes()
                            setSuccessMsg(json.message)
                            setLoading(false)
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

const [totalUsers, setTotalUsers] = useState(0)
    const getUsersList = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/list_users/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUsersDataList(json.result)
                    setTotalUsers(json.total_users)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getCiuponCodes = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/wallet_coupons')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setTransactions(json.result)
                    //console.log("dataa"+ transactions)
                }
            })
            .catch((error) => console.error("Goterr "+error))
            .finally(() => setLoading(false));
    }

    const [userName, setUserName] = useState(null)
    const searchUser = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ userName+'/search_user')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUsersDataList(json.result)
                }else{
                    alert(json.message)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        getUserDetails();
        getUsersList();
        if(token == null){
            window.location.replace("/login");
        }
        getCiuponCodes();
    },[])

    const openAirtimeDetails = (user) => {
        window.location.href = "/admin/"+user+"/user_details";
    }

    const getList =  <div class="row">					
        <div class="col-xl-12 col-12">
        <div class="box">
            <div class="box-header with-border">
              <h4 class="box-title">Registered Users ({totalUsers})</h4>
            </div>
            <div class="box-body pt-0">
                <div class="table-responsive">
                  <table class="table table-striped">
                      <tbody>
                  <tr>
                           <th><a href="javascript:void(0)">Username</a></th>
                           <th><a href="javascript:void(0)">Package</a></th>
                            <th>Status</th>
                        <th><span class="text-muted text-nowrap">
                           Date</span> </th>
                    </tr>
                  {usersDataList.map(usr =>
                    <tr onClick={()=>openAirtimeDetails(usr.username)}>
                      <td>{usr.username}</td>
                      <td>{usr.package}</td>
                      {usr.package_status == 0 ? <td class="text-danger">Pending</td> : null}
                      {usr.package_status == 1 ? <td class="text-success">Activated</td> : null}
                      <td><span class="text-muted text-nowrap">
                      {usr.created_at} </span> </td>
                      </tr>
                  )}
                  </tbody>
                   </table>
                </div>
            </div>
        </div>
    </div>				
          
                </div>
    

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
          <div class="row card">

<div class="col-xl-12 col-lg-12">
                <div class="box">
                    <div class="box-body text-center">
                        <div class="input-group mb-3">
                            <input class="form-control" type="text" 
                             onChange={e => setUserName(e.target.value)} 
                            placeholder="Enter Username or Email" 
                            value={userName} />
                            {isLoading? <LoadingImage /> 
                            : <button onClick={()=>{searchUser()}} class="btn btn-primary btn-sm"> Search </button>
                            }
                            </div>
                            </div>
                            </div>
                            </div>
                            
      <div className='row justify-content-center'>     
{isLoading? <LoadingImage /> : getList }
</div>  
             
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default RegisteredUsers;

const style = {
    logo: {width: 45, heiht: 45}
};