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

const ElectricityPrices = () => {

    
    const [userData, setUserData] = useState([]);
    const [servicesList, setServicesList] = useState([]);
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
   
const dataList = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/services-details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   // alert(JSON.stringify( json.data_billing))
                    setServicesList(json.electricity_billing)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const deleteAction = (id) => {
        if(window.confirm('Are you sure you want to delete Service?')){
          fetch(urls.apiurl +'admin/'+ token+'/'+ id+'/delete-electricity-service/')
          .then((response) => response.json())
          .then((json) => {
              if (json.status == 1) {
                  alert(json.message)
                  window.location.replace('/admin/electricity_prices_settings')
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

    useEffect(()=>{
        getUserDetails();
        dataList();
        if(token == null){
            window.location.replace("/login");
        }

    },[])

    const getList =  <div class="row">	
    <div class="box-header with-border">
                        <h4 class="box-title">Electricity Prices</h4>
                      </div>				
        <div class="col-xl-12 col-12">
        <Link to={"/admin/add_electricity_price"} className='btn btn-block btn-md btn-success m-5'> + Add New</Link>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <tbody>
                  <tr>
                  <th>Company</th>
                  <th>Code</th>
                  <th>Transaction Charges</th>
                        <th><span class="text-muted text-nowrap">
                           Delete</span> </th>
                    </tr>
                  {servicesList.map(sr =>
                    <tr>
                      <td>{sr.product}</td>
                      <td>{sr.product_code}</td>
                      <td>{sr.transaction_charges}</td>
                      <td><span class="text-muted text-nowrap">
                      <i onClick={()=>deleteAction(sr.id)} className='fa fa-times text-danger'> delete</i> </span> </td>
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

export default ElectricityPrices;

const style = {
    logo: {width: 45, heiht: 45}
};