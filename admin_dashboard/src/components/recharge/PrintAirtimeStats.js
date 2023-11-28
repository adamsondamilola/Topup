import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link, useParams } from 'react-router-dom';

const PrintAirtimeStats = () => {

   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [referralList, setReferralList] = useState([]);

    const [mtnAvailableAirtime, setMtnAvailableAirtime] = useState([]);
    const [gloAvailableAirtime, setGloAvailableAirtime] = useState([]);
    const [airtelAvailableAirtime, setAirtelAvailableAirtime] = useState([]);
    const [nmobileAvailableAirtime, setNmobileAvailableAirtime] = useState([]);

    const [mtnUsedAirtime, setMtnUsedAirtime] = useState([]);
    const [gloUsedAirtime, setGloUsedAirtime] = useState([]);
    const [airtelUsedAirtime, setAirtelUsedAirtime] = useState([]);
    const [nmobileUsedAirtime, setNmobileUsedAirtime] = useState([]);

    const [airtimeStats, setAirtimeStats] = useState([]);
    
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
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

    const getMTNAvailableArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/MTN/available_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setMtnAvailableAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getGloAvailableArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/GLO/available_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setGloAvailableAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getAirtelAvailableArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/AIRTEL/available_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setAirtelAvailableAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getNmobileAvailableArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/9MOBILE/available_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setNmobileAvailableAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getMTNUsedArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/MTN/used_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setMtnUsedAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getGloUsedArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/GLO/used_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setGloUsedAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getAirtelUsedArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/AIRTEL/used_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setAirtelUsedAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getNmobileUsedArtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/9MOBILE/used_airtime_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setNmobileUsedAirtime(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getAirtimeStats = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/airtime_print_amount_stats/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setAirtimeStats(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }


    useEffect(()=>{
        getUserDetails();

        getMTNAvailableArtimeStats()
        getNmobileAvailableArtimeStats()
        getGloAvailableArtimeStats()
        getAirtelAvailableArtimeStats()

        getMTNUsedArtimeStats()
        getNmobileUsedArtimeStats()
        getGloUsedArtimeStats()
        getAirtelUsedArtimeStats()

        getAirtimeStats()
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
                        <h4 class="box-title">Airtime Stats Summary</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                                    <tr>
                                    <td><span>Available</span></td>
                                    <td><span>Purchased</span></td>
                                    <td><span>Total Amount</span></td>
                                    </tr>
                                    <tr>
                                    <td><span>{NumberToNaira(airtimeStats.available_airtime_total_amount)} </span></td> 
                                    <td><span>{NumberToNaira(airtimeStats.purchased_airtime_total_amount)} </span></td> 
                                    <td><span>{NumberToNaira(airtimeStats.total_airtime_amount)} </span></td> 
                                    </tr>
                                    </tbody>
                                    </table>
                                    </div>
                        </div>
                        </div>
                        </div>
                        </div>
                  
                  <div class="row">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Available Airtime</h4>
                      </div>
                      <div class="box-body pt-0">

                          <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                            <tr>
                               <td><span class="text-muted">
                               Network</span> </td>
                               <td>
                                        <span class="mx-5">{NumberToNaira(100)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(200)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(400)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(500)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(1000)}</span>
                                </td>
                              </tr>
                              <tr>
                                <td><span>MTN</span></td>
                                <td><span>{mtnAvailableAirtime.amt100_available_airtime}</span> </td>
                                <td><span>{mtnAvailableAirtime.amt200_available_airtime}</span> </td>
                                <td><span>{mtnAvailableAirtime.amt400_available_airtime}</span> </td>
                                <td><span>{mtnAvailableAirtime.amt500_available_airtime}</span> </td>
                                <td><span>{mtnAvailableAirtime.amt1000_available_airtime}</span> </td>
                            </tr>
                            <tr>
                                <td><span>GLO</span></td>
                                <td><span>{gloAvailableAirtime.amt100_available_airtime}</span> </td>
                                <td><span>{gloAvailableAirtime.amt200_available_airtime}</span> </td>
                                <td><span>{gloAvailableAirtime.amt400_available_airtime}</span> </td>
                                <td><span>{gloAvailableAirtime.amt500_available_airtime}</span> </td>
                                <td><span>{gloAvailableAirtime.amt1000_available_airtime}</span> </td>
                            </tr>
                            <tr>
                                <td><span>AIRTEL</span></td>
                                <td><span>{airtelAvailableAirtime.amt100_available_airtime}</span> </td>
                                <td><span>{airtelAvailableAirtime.amt200_available_airtime}</span> </td>
                                <td><span>{airtelAvailableAirtime.amt400_available_airtime}</span> </td>
                                <td><span>{airtelAvailableAirtime.amt500_available_airtime}</span> </td>
                                <td><span>{airtelAvailableAirtime.amt1000_available_airtime}</span> </td>
                            </tr>
                            <tr>
                                <td><span>9MOBILE</span></td>
                                <td><span>{nmobileAvailableAirtime.amt100_available_airtime}</span> </td>
                                <td><span>{nmobileAvailableAirtime.amt200_available_airtime}</span> </td>
                                <td><span>{nmobileAvailableAirtime.amt400_available_airtime}</span> </td>
                                <td><span>{nmobileAvailableAirtime.amt500_available_airtime}</span> </td>
                                <td><span>{nmobileAvailableAirtime.amt1000_available_airtime}</span> </td>
                            </tr>
                            </tbody>
                             </table>
                          </div>

                      </div>
                  </div>
              </div>
              </div>

              <div class="row">					
                  <div class="col-xl-12 col-12">
                  <div class="box">
                      <div class="box-header with-border">
                        <h4 class="box-title">Purchased Airtime</h4>
                      </div>
                      <div class="box-body pt-0">

                          <div class="table-responsive">
                            <table class="table mb-0 table-striped">
                                <tbody>
                            <tr>
                               <td><span class="text-muted">
                               Network</span> </td>
                               <td>
                                        <span class="mx-5">{NumberToNaira(100)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(200)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(400)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(500)}</span>
                                </td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(1000)}</span>
                                </td>
                              </tr>
                              <tr>
                                <td><span>MTN</span></td>
                                <td><span>{mtnUsedAirtime.amt100_used_airtime}</span> </td>
                                <td><span>{mtnUsedAirtime.amt200_used_airtime}</span> </td>
                                <td><span>{mtnUsedAirtime.amt400_used_airtime}</span> </td>
                                <td><span>{mtnUsedAirtime.amt500_used_airtime}</span> </td>
                                <td><span>{mtnUsedAirtime.amt1000_used_airtime}</span> </td>
                            </tr>
                            <tr>
                                <td><span>GLO</span></td>
                                <td><span>{gloUsedAirtime.amt100_used_airtime}</span> </td>
                                <td><span>{gloUsedAirtime.amt200_used_airtime}</span> </td>
                                <td><span>{gloUsedAirtime.amt400_used_airtime}</span> </td>
                                <td><span>{gloUsedAirtime.amt500_used_airtime}</span> </td>
                                <td><span>{gloUsedAirtime.amt1000_used_airtime}</span> </td>
                            </tr>
                            <tr>
                                <td><span>AIRTEL</span></td>
                                <td><span>{airtelUsedAirtime.amt100_used_airtime}</span> </td>
                                <td><span>{airtelUsedAirtime.amt200_used_airtime}</span> </td>
                                <td><span>{airtelUsedAirtime.amt400_used_airtime}</span> </td>
                                <td><span>{airtelUsedAirtime.amt500_used_airtime}</span> </td>
                                <td><span>{airtelUsedAirtime.amt1000_used_airtime}</span> </td>
                            </tr>
                            <tr>
                                <td><span>9MOBILE</span></td>
                                <td><span>{nmobileUsedAirtime.amt100_used_airtime}</span> </td>
                                <td><span>{nmobileUsedAirtime.amt200_used_airtime}</span> </td>
                                <td><span>{nmobileUsedAirtime.amt400_used_airtime}</span> </td>
                                <td><span>{nmobileUsedAirtime.amt500_used_airtime}</span> </td>
                                <td><span>{nmobileUsedAirtime.amt1000_used_airtime}</span> </td>
                            </tr>
                            </tbody>
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

export default PrintAirtimeStats;
