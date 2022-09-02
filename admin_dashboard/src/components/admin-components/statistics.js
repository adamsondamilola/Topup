import React, { Component, useEffect, useState } from 'react';

import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';

import { Chart } from "react-google-charts";  
import { Link } from 'react-router-dom';

const Statistics = () => {

    const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);

   

    const [siteStat, setSiteStat] = useState([]);
    const getSiteDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/site_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setSiteStat(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

            fetch(urls.apiurl +'admin/'+ token+'/100/bank_withdrawal_transactions/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setPendingWithdrawal(json.pending_withdrawal)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

    }


    const data = [
      ["Data", "Balances"],
      ["Main Wallet", siteStat.main_wallet],
      ["Cash-back", siteStat.cashback_balance],
      ["Cash-back Withdrawn", siteStat.cashback_withdrawn],
      ["Commission", siteStat.referral_balance],
      ["Commission Withdrawn", siteStat.referral_withdrawn],
    ];

    const data_2 = [
      ["Data", "Users"],
      ["Active", siteStat.active_users],
      ["Inactive", siteStat.inactive_users]
    ];

    const options_1 = {
      title: "Wallet Balances",
    };

    const options_2 = {
      title: "Users",
    };

    useEffect(()=>{
        getSiteDetails();
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
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Statistics </h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">
                                 <div class="row">
                                  
                   {/*              <div class="col-xl-6 col-12">
				<div class="box box-body">
        <Chart
      chartType="PieChart"
      data={data}
      options={options_1}
      width={"100%"}
      height={"400px"}
    />
				</div>
			</div>

      <div class="col-xl-6 col-12">
				<div style={{width: "100%", height: "500px"}} class="box box-body">
        <Chart
      chartType="PieChart"
      data={data_2}
      options={options_2}
      width={"100%"}
      height={"400px"}
    />
				</div>
			</div> */}

<div class="col-xl-4 col-12">
			<Link to={"/admin/withdrawal_transactions"}>
        <div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Withdrawal Request</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{pendingWithdrawal}</span>
					<span class="fa fa-send fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
        </Link>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Registered Users</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{siteStat.total_users}</span>
					<span class="fa fa-users fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Active Users</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{siteStat.active_users}</span>
					<span class="fa fa-shield fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>

            <div class="col-xl-4 col-12">
				<div class="box box-body bg-danger">
				  <h6 class="text-uppercase text-white">Inactive Users</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{siteStat.inactive_users}</span>
					<span class="fa fa-times fs-40"><span class="path1"></span><span class="path2"></span></span>
				  </div>
				</div>
			</div>
                                
                  
            <div class="col-xl-4 col-12">
				<div class="box box-body bg-warning">
				  <h6 class="text-uppercase text-white">Pck Revenue</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.package_revenue)} </span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Pending Pck Revenue</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.pending_package_revenue)} </span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-primary">
				  <h6 class="text-uppercase text-white">Commission</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.referral_balance)} </span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-success">
				  <h6 class="text-uppercase text-white">Commission Withdrawn</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.referral_withdrawn)} </span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-warning">
				  <h6 class="text-uppercase text-white">Cash Back</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.cashback_balance)} </span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-secondary">
				  <h6 class="text-uppercase text-dark">Cash Back Withdrawn</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.cashback_withdrawn)} </span>
				  </div>
				</div>
			</div>

      <div class="col-xl-4 col-12">
				<div class="box box-body bg-info">
				  <h6 class="text-uppercase text-white">Main Wallet</h6>
				  <div class="flexbox mt-2">
					<span class=" fs-30">{NumberToNaira(siteStat.main_wallet)} </span>
				  </div>
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

export default Statistics;

const style = {
    logo: {width: 45, heiht: 45}
};