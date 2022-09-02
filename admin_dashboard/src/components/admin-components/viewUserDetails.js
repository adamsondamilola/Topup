import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ViewUserDetails = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const copyToClipboard = (text) => {
        const el = text
        window.navigator.clipboard.writeText(text)
        alert("link copied")
      }

      const {username} = useParams();
      const [referralList, setReferralList] = useState([]);
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

    const [webSet, setWebSet] = useState([])
    const websiteSettings = () => {    
        getUserDetails();
        fetch(urls.apiurl +'admin/website_settings')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   setWebSet(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }

    const suspensionBtn = (text) => {
      if(window.confirm('Are you sure you want to '+text+' '+userData.first_name+' '+userData.last_name+' with username: '+username+'?')){
        fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/deactivate_activate_account/')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1) {
                alert(json.message)
                getUserDetails()
            }else{
              alert(json.message)
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
      }else{
        //
      }
      
  }

  const makeAdminBtn = (text) => {
    if(window.confirm('Are you sure you want to '+text+' '+userData.first_name+' '+userData.last_name+' with username: '+username+' as Admin?')){
      fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/make-admin/')
      .then((response) => response.json())
      .then((json) => {
          if (json.status == 1) {
              alert(json.message)
              getUserDetails()
          }else{
            alert(json.message)
          }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    }else{
      //
    }
    
}


  const deleteAccountBtn = () => {
    if(window.confirm('Are you sure you want to delete/remove '+userData.first_name+' '+userData.last_name+' with username: '+username+' totally from this system?')){
      fetch(urls.apiurl +'admin/'+ token+'/'+ username+'/delete_account/')
      .then((response) => response.json())
      .then((json) => {
          if (json.status == 1) {
              alert(json.message)
              window.location.replace('/admin/stats')
          }else{
            alert(json.message)
          }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    }else{
      //
    }
    
}


  const openReferralDetails = (user) => {
        window.location.href = "/admin/"+user+"/user_details";
    }


const [showProfile, setShowProfile] = useState(false)
const showProfileBtn = () =>{
  if(showProfile === false) setShowProfile(true)
  else setShowProfile(false)
}

    useEffect(()=>{
        websiteSettings();
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
                        <h4 class="box-title">Referral Link</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="input-group mb-3">
                                    <button onClick={() => copyToClipboard(webSet.url+"/"+userData.username+"/invite")} class="btn btn-primary" readOnly style={{width:80, fontSize: 15}}>COPY</button>
                                    <input class="form-control text-dark"
                                    type="tel" 
                                    value={webSet.url+"/"+userData.username+"/invite"}/>
                                    </div>
                         </div>
                  </div>
              </div>

              <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">User Profile </h4>
                      </div>
                      <div class="box-body pt-0">

                        {showProfile ? 
                        <div class="table-responsive">
                        <table class="table mb-0 table-striped">
                            <tbody>
                            <tr>
                                    <th>First Name</th>
                                    <td>{userData.first_name}</td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>{userData.last_name}</td>
                                </tr>
                                <tr>
                                    <th>Userame</th>
                                    <td>{userData.username}</td>
                                </tr>
                                <tr>
                                    <th>Package</th>
                                    <td>{userData.package}</td>
                                </tr>
                                <tr>
                                    <th>Package Status</th>
                                    <td>
                                    {userData.package_status == 0 ? <td class="text-danger">Pending</td> : null}
                                    {userData.package_status == 1 ? <td class="text-success">Activated</td> : null}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Sponsor</th>
                                    <td>{userData.referral}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{userData.email}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>{userData.phone}</td>
                                </tr>
                                <tr>
                                    <th>Role</th>
                                    <td>{userData.role}</td>
                                </tr>
                                <tr>
                                    <th>Country</th>
                                    <td>{userData.country}</td>
                                </tr>
                            </tbody>
                            </table>
                            </div>
                             : ''}

                      <div className='row mt-15'>
                      <div class="col-xl-3 col-12 mb-10"> 
                      <button style={{width:'100%'}} onClick={() => showProfileBtn()} className='btn btn-block btn-success'> <i className='fa fa-user'></i> Show/Hide Profile </button> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/edit_account"} className='btn btn-primary btn-block'> <i className='fa fa-pencil'></i> Edit Profile</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/edit_wallet"} className='btn btn-info btn-block'> <i className='fa fa-pencil-square'></i> Edit Wallet</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/transfer"} className='btn btn-block btn-primary'> <i className='fa fa-briefcase'></i> Fund Wallet</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/transfers"} className='btn btn-block btn-info'> <i className='fa fa-send'></i> Transfers</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/user_transactions"} className='btn btn-block btn-dark'> <i className='fa fa-list'></i> Transactions</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/upgrade_downgrade"} className='btn btn-block btn-danger'> <i className='fa fa-tachometer'></i> Upgrade / Downgrade</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/user_reset_password"} className='btn btn-block btn-warning'> <i className='fa fa-unlock'></i> Reset Password</Link> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/user_reset_pin"} className='btn btn-block btn-danger'> <i className='fa fa-key'></i> Reset PIN</Link> 
                      </div>

                      


{userData.status == 1?  
                      
                        <div class="col-xl-3 col-12 mb-10"> 
                      <button style={{width:'100%'}} onClick={() => suspensionBtn("Suspend") } className='btn btn-block btn-secondary'> <i className='fa fa-user-times'></i> Suspend Account</button> 
                      </div>
                    
 :
                       
                        <div class="col-xl-3 col-12 mb-10">
                      <button style={{width:'100%'}} onClick={() => suspensionBtn("Remove Suspension") } className='btn btn-block btn-primary'> <i className='fa fa-check'></i> Remove Suspension</button> 
                      </div>
}
                      <div class="col-xl-3 col-12 mb-10"> 
                       <button style={{width:'100%'}} onClick={()=>deleteAccountBtn()} className='btn btn-block btn-danger'> <i className='fa fa-trash'></i> Delete Account</button> 
                      </div>

                      <div class="col-xl-3 col-12 mb-10"> 
                      <Link style={{width:'100%'}} to={"/admin/"+username+"/networks"} className='btn btn-block btn-primary'> <i className='fa fa-users'></i> Networks</Link> 
                      </div>

                      {userData.role == "Admin"?  
                      
                      <div class="col-xl-3 col-12 mb-10"> 
                    <button style={{width:'100%'}} onClick={() => makeAdminBtn("remove") } className='btn btn-block btn-warning'> <i className='fa fa-user-times'></i> Remove as Admin</button> 
                    </div>
                  
:
                     
                      <div class="col-xl-3 col-12 mb-10">
                    <button style={{width:'100%'}} onClick={() => makeAdminBtn("make") } className='btn btn-block btn-success'> <i className='fa fa-check'></i> Make Admin</button> 
                    </div>
}

                      </div>


                         </div>
                  </div>
              </div>	



             
              <div class="box-body">
                          <div class="row mb-20">
                                 <div class="row">
                                  
                                 <div class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Package ({userData.package_status == 0? 'Not Active' : 'Active'})</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{userData.package}</span>
					<span class="fa fa-cube fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Main Wallet</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.main_wallet)}</span>
					<span class="fa fa-cube fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-danger">
				  <h6 class="text-uppercase text-white">Points</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{wallet.points}</span>
					<span class="fa fa-shield fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Referral Commission</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.referral_balance)}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>
                                
            <div class="col-xl-4 col-12">
				<div class="box box-body bg-danger">
				  <h6 class="text-uppercase text-white">Commission Withdrawn</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.referral_withdrawn)}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>
                                
                  
            <div class="col-xl-4 col-12">
				<div class="box box-body bg-warning">
				  <h6 class="text-uppercase text-white">Cashback Allocated</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.cashback_balance)} </span>
					<span class="fa fa-database fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Cashback Withdrawn</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.cashback_withdrawn)} </span>
					<span class="fa fa-bank fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Cashback Pending</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(wallet.cashback_pending)} </span>
					<span class="fa fa-refresh fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Referrals</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{referrals} </span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

                              </div>
                          </div>
                          
                      </div>


                    
                          </div>					
              </div>
            
          </div>	
          

          {/* <div class="row">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Referral List</h4>
                      </div>
                      <div class="box-body pt-0">

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
              </div>	 */}


      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default ViewUserDetails;

const style = {
    logo: {width: 45, heiht: 45}
};