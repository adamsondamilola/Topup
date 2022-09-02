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

const ApiKeys = () => {

    
    const [userData, setUserData] = useState([]);
    const [usersDataList, setUsersDataList] = useState([]);
    const [apis, setSetApis] = useState([]);
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
   
const apiList = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/list-api/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setSetApis(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

  

    const [userName, setUserName] = useState(null)
    

    useEffect(()=>{
        getUserDetails();
        apiList();
        if(token == null){
            window.location.replace("/login");
        }

    },[])

    const openDetails = (user) => {
        window.location.href = "/admin/"+user+"/edit_api";
    }

    const getList =  <div class="row">					
        <div class="col-xl-12 col-12">
        <Link to={"/admin/add_api"} className='btn btn-block btn-md btn-success m-5'> + Add New</Link>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <tbody>
                  <tr>
                  <th>Title</th>
                  <th>Main Key</th>
                  <th>Secret Key</th>
                  <th>Contract Code</th>
                  <th>End Point</th>
                        <th><span class="text-muted text-nowrap">
                           Date</span> </th>
                    </tr>
                  {apis.map(api =>
                    <tr onClick={()=>openDetails(api.id)}>
                      <td>{api.api_provider}</td>
                      <td>{api.public_key}</td>
                      <td>{api.api_secret_key}</td>
                      <td>{api.contract_code}</td>
                      <td>{api.end_point}</td>
                      <td><span class="text-muted text-nowrap">
                      {api.created_at} </span> </td>
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

export default ApiKeys;

const style = {
    logo: {width: 45, heiht: 45}
};