import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link, useParams } from 'react-router-dom';

const Referrals = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [referralList, setReferralList] = useState([]);
    const [pendingPackage, setPendingPackage] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const {username} = useParams();
    const [referrals, setReferrals] = useState(0);
    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result.user)
                    setWallet(json.result.wallet)
                    setReferralList(json.result.referrals_list)
                    setReferrals(json.result.referrals)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const openReferralDetails = (user) => {
        window.location.href = "/admin/"+user+"/user_details";
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
                        <h4 class="box-title">Referral List</h4>
                      </div>
                      <div class="box-body pt-0">

                      <div class="col-xl-12 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Referrals</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{referrals}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

                          <div class="table-responsive">
                            <table class="table mb-0">
                            <tr>
                               <td><span class="text-muted text-nowrap">
                               Package</span> </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">Username</span>
                                    </div>
                                </td>
                                <td class="text-end">Status</td>
                              </tr>
                            {referralList.map(tr =>
                              <tr onClick={()=>openReferralDetails(tr.username)}>
                                <td><a href="#">{tr.package}</a></td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <span class="mx-5">{tr.username}</span>
                                    </div>
                                </td>
                                {tr.status == 0 ? <td class="text-end text-danger">Pending</td> : null}
                                {tr.status == 1 ? <td class="text-end text-success">Activated</td> : null}
                                {tr.status == 2 ? <td class="text-end text-warning">Declined</td> : null}
                              </tr>
                            )}
                             </table>
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

export default Referrals;

const style = {
    logo: {width: 45, heiht: 45}
};