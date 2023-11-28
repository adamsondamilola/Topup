import React, { Component, forwardRef, useEffect, useRef, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link, useParams } from 'react-router-dom';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';

const ViewTransactions = () => {

   const {id} = useParams()
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);
   

    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                    setUserData(json.result)
                    setWallet(json.result.wallet)
                }else{
                    window.location.replace("/login");
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const viewTransaction = () => {
        setLoading(true)
        const headers = { 'Content-Type': 'application/json' }
    fetch(urls.apiurl +'transaction/'+ token+'/'+id+'/view_transactions', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactionDetails(data.result) 
              //  alert(data.result.id)                   
            }
        });
    }

    const [website, setWebsite] = useState([]);
  const websiteSettings = () => {        
    fetch(urls.apiurl +'admin/website_settings')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == 1) {
                var x = json.result;
                setWebsite(x)
                }
        })
        .catch((error) => console.error(error))
        .finally(() => console.log("done"));
}

    useEffect(()=>{
        websiteSettings()
        getUserDetails();
        viewTransaction();
        if(token === null){
            window.location.replace("/login");
        }
    },[])


    const [print, setPrint] = useState(true);
    let ref = useRef();
    const ComponentToPrint = forwardRef((props, ref) => {
        return <div className='row' ref={ref}>
                <div class="col-xl-12 col-12">

<div class="box">
    <div class="box-header with-border">
      <h4 class="box-title">Transaction Details</h4>
    </div>
    <div class="box-body pt-0">
      <div className='col-md-12'>
        <div class="table-responsive">
          <table style={{width: `100%`}} class="tablem mb-0">
<tbody>
            <tr>
<th>Transaction ID<br/><br/></th>
<td class="text-end">#{transactionDetails.id}<br/><br/></td>
</tr>
<tr>
<th>Date & Time<br/><br/></th>
<td class="text-end">{transactionDetails.created_at}<br/><br/></td>
</tr>
<tr>
<th>Type<br/><br/></th>
<td class="text-end">{transactionDetails.type}<br/><br/></td>
</tr>
<tr>
<th>Amount<br/><br/></th>
<td class="text-end">{NumberToNaira(transactionDetails.amount)}<br/><br/></td>
</tr>
{transactionDetails.package == "Airtime" || transactionDetails.package == "Data"?
<tr>
<th>Phone<br/><br/></th>
<td class="text-end">{transactionDetails.phone}<br/><br/></td>
</tr>
: ''}
{transactionDetails.sender != null?
<tr>
<th>Sent by<br/><br/></th>
<td class="text-end">{transactionDetails.sender}<br/><br/></td>
</tr>
: ''}
{transactionDetails.receiver != null?
<tr>
<th>Received by<br/><br/></th>
<td class="text-end">{transactionDetails.receiver}<br/><br/></td>
</tr>
: ''}
<tr>
<th>Status<br/><br/></th>
<td class="text-end">
{transactionDetails.status == 0? 'Pending' : ''}
{transactionDetails.status == 1? 'Successful' : ''}
{transactionDetails.status == 0? 'Declined' : ''}
    <br/><br/></td>
</tr>
<tr>
<th>Vendor/Username<br/><br/></th>
<td class="text-end">{transactionDetails.username}<br/><br/></td>
</tr>
<tr>
<td colSpan={2} class="text-center"><b>Thanks for choosing {website.title}!</b></td>
</tr>
            </tbody>
           </table>
        </div>
        </div>
    </div>
</div>
</div>     
        </div>;
      });
  

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  
                  <div class="row">	

                 

  {print === true? <div className='row'>
  <div class="col-xl-12 col-12">
<ReactToPrint content={() => ref.current}>
<PrintContextConsumer>
{({ handlePrint }) => (
<button className='btn btn-primary text-right m-5' onClick={handlePrint}>
Print Receipt <i className='fa fa-print'></i>
</button>
)}
</PrintContextConsumer>
</ReactToPrint>
<ComponentToPrint ref={ref} />
</div>      
</div> : ''}  

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

export default ViewTransactions;

const style = {
    logo: {width: 45, heiht: 45}
};