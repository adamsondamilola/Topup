import React, { Component, forwardRef, useEffect, useRef, useState } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import images from '../../constants/images';
import logos from '../../constants/logos';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';

const PrintAirtime = () => {

    const service = [
        {
            id: 1,
            path: "01",
            service: "MTN",
            type: "MTN Airtime",
            img: logos.mtn, 
            dial_code: "*555*PIN#", 
            selected: 0 
        },
        {
            id: 2,
            path: "02",
            service: "GLO",
            type: "GLO Airtime",
            img: logos.glo, 
            dial_code: "*123*PIN#",
            selected: 0 
        },
        {
            id: 3,
            path: "04",
            service: "AIRTEL",
            type: "AIRTEL Airtime",
            img: logos.airtel, 
            dial_code: "*126*PIN#",
            selected: 0 
        },
        {
            id: 4,
            path: "03",
            service: "9MOBILE",
            type: "9Mobile Airtime",
            img: logos.nmobile, 
            dial_code: "*222*PIN#",
            selected: 0 
        }
        
    ]

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
            x = "*555*PIN#"
        }
        if(x == "GLO"){
            x = "*123*PIN#"
        }
        if(x == "AIRTEL"){
            x = "*126*PIN#"
        }
        if(x == "9MOBILE"){
            x = "*222*PIN#"
        }
        return x
        
    }
   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [services, setServices] = useState(service);
    const [phone, setPhone] = useState(null);
    const [amount, setAmount] = useState(null);
    const [numberOfCard, setNumberOfCard] = useState(1);
    const [network, setNetwork] = useState(null);
    const [networkName, setNetworkName] = useState(null);
    const [type, setType] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [checkOut, setCheckOut] = useState(false);
    const [print, setPrint] = useState(false);

    const [pin, setPin] = useState(null);
    const [commission, setCommission] = useState(0);
    const [purchaseCost, setPurchaseCost] = useState(0);
    const [cashBack, setCashBack] = useState(0);

    function openAirtimeDetails(x){
        window.location.href = "/user/"+x+"/view_airtime";
    }

    const setCompanName_ = (x) =>{
        localStorage.setItem('companyName', x);
    }

    let ref = useRef();
    const ComponentToPrint = forwardRef((props, ref) => {
        return <div className='row' ref={ref}>
                <div class="table-responsive">
    {cardDetails.map(c =>
    <div class="col-xl-4 col-12">
    <div class="table-responsive">     
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
      <th><a href="javascript:void(0)">PIN</a></th>
      <td class="text-end">{c.pin}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">Dial</a></th>
      <td class="text-end">{setDialCode(cardDetails_.network)}</td>
    </tr>
    <tr>
      <th><a href="javascript:void(0)">S/N</a></th>
      <td class="text-end">{c.serial_number}</td>
    </tr>
    </tbody>
   </table>
   </div>
   </div>
   )}
</div>      
        </div>;
      });

    let amt = parseFloat(amount)

    function selectNetwork(id){
        var objIndex2 = service.findIndex((obj => obj.id != parseInt(id)));
        services[objIndex2].selected = 0;
        var objIndex = service.findIndex((obj => obj.id == parseInt(id)));
        service[objIndex].selected = 1;
        setServices(JSON.parse(JSON.stringify(service)));

        //get selected details
var data = service.filter((obj => obj.id == parseInt(id)));
setNetwork(data[0].path)
setType(data[0].type)
setlogo(data[0].img)
setNetworkName(data[0].service)
//setDialCode(data[0].dial_code)

setCardDetails([])
setCardDetails_([])
setPrint(false)
setCheckOut(false)
setSuccessMsg(null)
}

    const verifyInput = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: networkName,
                amount: amount,
                network_code: network,
                username: userData.username
             })
        };
    
        fetch(urls.apiurl + 'recharge/verify_airtime_input', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setCheckOut(true)
                            //setAmount(json.amount * numberOfCard)
                            setCommission(json.commission * numberOfCard)
                            setCashBack(json.cash_back * numberOfCard)
                            setPurchaseCost(json.purchase_cost * numberOfCard)
//                            setSuccessMsg("Fund Successfully Added")
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

    const buyAirtimeAction = () => {
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                network: networkName,
                amount: amount.toString(),
                quantity: numberOfCard,
                pin: pin,
                token: token 
             })
        };
    
        fetch(urls.apiurl + 'recharge/print_airtime ', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setSuccessMsg(json.message)
                            setOrderId(json.airtime_id)
                            getAirtimePrintDetails(json.airtime_id)
                            getUserDetails()
                            setPrint(true)
                            setLoading(false)
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }


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
    const getAirtimePrintDetails = (id) => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/'+id+'/get_airtime_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   let x = json.result.json_data
                   //alert(x)
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
        getAirtimePrintList();
        if(token == null){
            window.location.replace("/login");
        }
    },[])

   

    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Airtime</h4>
                          </div>
                      <div class="box-body">

                          {print? <div className='row'>
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
 </div> : null}

{!print ?
      <div>                        
                             {checkOut && !print? 
                             
                             <div className='row'>
                              <div class="table-responsive">
                            <table class="table mb-0">
                                <tbody>
                                <tr>
                                <td className='text-center' colSpan={2} class="text-end">
                                <img src={logo} style={style.logo} />
                                </td>
                              </tr>
                                <tr>
                                <th><a href="javascript:void(0)">Service</a></th>
                                <td class="text-end">{type}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Phone</a></th>
                                <td class="text-end">{phone}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Commission</a></th>
                                <td class="text-end">{commission}%</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Number of Voucher </a></th>
                                <td class="text-end">{numberOfCard}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Cost per Voucher </a></th>
                                <td class="text-end">{NumberToNaira(amount)}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Actual Cost </a></th>
                                <td class="text-end">{NumberToNaira(amt*numberOfCard)}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Purchase Cost</a></th>
                                <td class="text-end">{NumberToNaira(purchaseCost)}</td>
                              </tr>
                              <tr>
                                <th><a href="javascript:void(0)">Cash back</a></th>
                                <td class="text-end">{NumberToNaira(cashBack)}</td>
                              </tr>
                          {successMsg == null?    <tr>
                                <th><input type="password" value={pin}
      onChange={e => setPin(e.target.value)} 
      maxLength='4'
      placeholder='Enter PIN'
      className='form-control'/></th>
                                <td>
                                {isLoading? <LoadingImage /> :
                                <div>
                                    <button onClick={() => setCheckOut(false)} className='btn btn-secondary'>Back</button> &nbsp;
                                    <button onClick={() => buyAirtimeAction()} className='btn btn-primary'>Confirm</button>
                                </div>
                                
                            }
                            </td>
                              </tr> : null }
                              {successMsg != null? 
                                <tr>
                                  <td className='text-center' colSpan={2}>
                                      <i className='fa fa-check-circle fa-3x text-success'></i><br/>
                                      <p>{successMsg}</p>
                                  </td>
                              </tr>
                              : null }
                              </tbody>
                             </table>
                             {errMsg != null? <ErrorMessage message={errMsg}/> : null  }
                          </div>
                              </div>
                              
                              : 
                             
                             <div class="row">        
        {services.map(x =>
        <div onClick={() => selectNetwork(x.id)} class="col-xl-3 col-lg-6">
        <div class="box">
            <div class="box-body text-center">
                <div class="d-flex justify-content-around">
                <div>
                        <img src={x.img} style={style.logo} />
                    </div>
                    <div class="b-1"></div>
                    {x.selected ? <i className='fa fa-check-circle fa-3x text-success'></i>
                    : 
                    <div>
                        <h6 class="my-0">{x.service}</h6>
                        <p class="mb-0 text-fade">select</p>
                    </div>
                    }
                   
                </div>
            </div>
        </div>
    </div>
        )}
<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Company Name</label>
<input className='form-control' value={companyName} onChange={e => {setCompanyName(e.target.value); setCompanName_(e.target.value)}} />
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Amount</label>
<select className='form-control form-select' onChange={e => setAmount(e.target.value)}>
<option>Select</option>
<option value={"100"}>{NumberToNaira(100)}</option>
<option value={"200"}>{NumberToNaira(200)}</option>
<option value={"400"}>{NumberToNaira(400)}</option>
<option value={"500"}>{NumberToNaira(500)}</option>
<option value={"1000"}>{NumberToNaira(1000)}</option>
</select>
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Number of Airtime</label>
<input className='form-control' type={"number"} onChange={e => setNumberOfCard(e.target.value)}/>
</div>
</div>


<div class="col-xl-12 col-lg-12">
<div class="col-xl-3 col-lg-6">
<div class="box">
{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
{isLoading? <LoadingImage /> :
<button onClick={()=>verifyInput()} className='btn btn-primary'>Proceed</button>
                            }

</div>
</div>
</div>

     </div>
     }
</div>
: null}

<div className='row'>
<div class="col-xl-12 col-lg-12">
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
      </section>
    </div>
</div>
</div>
;

}

export default PrintAirtime;

const style = {
    logo: {width: 50, heiht: 50}
};