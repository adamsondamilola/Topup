import React, { Component, forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import images from '../../constants/images';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';

const ViewGeneratedAirtime = () => {

    const {id} = useParams();

    function getLogo(x){
        if(x == "MTN"){
            x = logos.mtn
        }
        if(x == "GLO"){
            x = logos.glo
        }
        if(x == "AIRTEL"){
            x = logos.airtel
        }
        if(x == "9MOBILE"){
            x = logos.nmobile
        }
        return x
        
    }
    function setDialCode(x){
        if(x == "MTN"){
            x = "*311*PIN#"
        }
        if(x == "GLO"){
            x = "*311*PIN#"
        }
        if(x == "AIRTEL"){
            x = "*311*PIN#"
        }
        if(x == "9MOBILE"){
            x = "*311*PIN#"
        }
        return x
        
    }
   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [amount, setAmount] = useState(100);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [isLoading, setLoading] = useState(false);
    const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
    
    let ref = useRef();
    const ComponentToPrint = forwardRef((props, ref) => {
        return <div className='row' ref={ref}>
                
    {cardDetails.map(c =>   
    <div class="col-md-4 col-xl-4">
    <div class=""> 
  <table class="table">
      <tbody>
      <tr>
          <td className='text-center'><b>{NumberToNaira(parseFloat(cardDetails_.amount))}</b> | {cardDetails_.network}
          <br/> {companyName}
          </td>
      <td class="text-end">
      <img src={getLogo(cardDetails_.network)} style={style.logo} />
      </td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">S/N</a></th>
      <td class="text-end">{c.serial_number}</td>
    </tr>
      <tr>
      <th><a href="javascript:void(0)">PIN</a></th>
      <td class="text-end">{c.pin}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Dial</a></th>
      <td class="text-end">{setDialCode(cardDetails_.network)}</td>
    </tr>
    </tbody>
   </table>
   </div>
   </div>
   )}
</div>      
        ;
      });

    let amt = parseFloat(amount)

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

    const [cardDetails, setCardDetails] = useState([])
    const [cardDetails_, setCardDetails_] = useState([])
    const getAirtimePrintDetails = () => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/'+id+'/get_airtime_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   let x = json.result.json_data
                  // let y = x.TXN_EPIN
                   setCardDetails(x)
                   setCardDetails_(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const [airtimeList, setAirtimeList] = useState([])
    const getAirtimePrintList = () => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/get_airtime_list/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
setAirtimeList(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        getUserDetails();
        getAirtimePrintDetails()
        getAirtimePrintList();
        if(token == null){
            window.location.replace("/login");
        }
    },[])

    function openAirtimeDetails(x){
        window.location.href = "/user/"+x+"/view_airtime";
    }

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Airtime</h4>
                          </div>
                      <div class="box-body">


                          <div className='row'>
                          <div class="col-xl-12 col-12">
    <ReactToPrint content={() => ref.current}>
   <PrintContextConsumer>
          {({ handlePrint }) => (
            <button className='btn btn-primary text-right m-5' onClick={handlePrint}>
                Print <i className='fa fa-print'></i>
            </button>
          )}
        </PrintContextConsumer>
        </ReactToPrint>
<ComponentToPrint ref={ref} />
</div>      
 </div>

<div className='row mt-5'>
<div class="col-md-12 col-xl-12">
<div class="table-responsive">
    <table className='table table-striped'>
        <tbody>
            <tr>
                <th colSpan={4}>
                    Recent Generated Airtime
                </th>
            </tr>
            <tr>
            <th>
                    Network
                </th>
                <th>
                    Total Amount
                </th>
                <th>
                    Total Card
                </th>
                <th>
                    Date
                </th>
            </tr>
            {airtimeList.map( ar =>
                <tr onClick={()=>openAirtimeDetails(ar.id)}>
                    <td>
                        {ar.network}
                        </td>
                        <td>
                        {NumberToNaira(ar.total_amount)}
                        </td>
                        <td>
                        {ar.quantity}
                        </td>
                        <td>
                        {ar.created_at}
                        </td>
                    </tr>
            )}
        </tbody>
    </table>
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

export default ViewGeneratedAirtime;

const style = {
    logo: {width: 50, heiht: 50}
};