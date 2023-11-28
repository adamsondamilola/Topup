import React, { Component, useEffect, useState } from 'react';

import urls from '../../constants/urls';
import { Link } from 'react-router-dom';
import LoadingImage from '../loadingImage';

const Faqs = () => {

    
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
        fetch(urls.apiurl +'admin/'+ token+'/list-questions/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   // alert(JSON.stringify( json.data_billing))
                    setServicesList(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const deleteAction = (id) => {
        if(window.confirm('Are you sure you want to delete Question?')){
          fetch(urls.apiurl +'admin/'+ token+'/'+ id+'/delete-question/')
          .then((response) => response.json())
          .then((json) => {
              if (json.status == 1) {
                  alert(json.message)
                  window.location.replace('/admin/faq')
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
                        <h4 class="box-title">Questions</h4>
                      </div>				
        <div class="col-xl-12 col-12">
        <Link to={"/admin/add_faq"} className='btn btn-block btn-md btn-success m-5'> + Add New</Link>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <tbody>
                  <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Action</th>
                    </tr>
                  {servicesList.map(sr =>
                    <tr>
                      <td>{sr.question}</td>
                      <td>{sr.answer}</td>
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

export default Faqs;

const style = {
    logo: {width: 45, heiht: 45}
};