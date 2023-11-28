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

const AdminAccounts = () => {

    
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
   
const getAdminList = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/list-admin/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUsersDataList(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

  

    const [userName, setUserName] = useState(null)
    

    useEffect(()=>{
        getUserDetails();
        getAdminList();
        if(token == null){
            window.location.replace("/login");
        }

    },[])

    const openAirtimeDetails = (user) => {
        window.location.href = "/admin/"+user+"/user_details";
    }

    const getList =  <div class="row">					
        <div class="col-xl-12 col-12">
      <Link to={"/admin/registered_users"} className='btn btn-block btn-md btn-success m-5'> + Add New</Link>
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
    

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
          <div class="row card">
                            
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

export default AdminAccounts;

const style = {
    logo: {width: 45, heiht: 45}
};