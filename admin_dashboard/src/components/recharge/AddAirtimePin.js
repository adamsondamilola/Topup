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
import SuccessMessage from '../../utilities/successMessage';
 
const AddAirtimePin = () => {

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
   
    const [userData, setUserData] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [logo, setlogo] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [dialCode, setDialCode] = useState(null);
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
    const [serialNumber, setSerialNumber] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const getTransactions = () => {
        setLoading(true)
        const headers = { 'Content-Type': 'application/json' }
    fetch(urls.apiurl +'admin/'+ token+'/20/admin_airtime_pins', { headers })
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                setTransactions(data.result)                    
            }
        });

    }

    const setCompanName_ = (x) =>{
        localStorage.setItem('companyName', x);
    }

   


    function selectNetwork(id){
        var objIndex2 = service.findIndex((obj => obj.id != parseInt(id)));
        services[objIndex2].selected = 0;
        var objIndex = service.findIndex((obj => obj.id == parseInt(id)));
        service[objIndex].selected = 1;
        setServices(JSON.parse(JSON.stringify(service)));

        //get selected details
var data = service.filter((obj => obj.id == parseInt(id)));
setNetwork(data[0].service)
setlogo(data[0].img)
setSuccessMsg(null)
}

    const addAirtimeAction = () => {
        setErrMsg(null)
        setSuccessMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                login_token: token,
                amount: amount,
                pin: pin,
                serial_number: serialNumber,
                network: network
             })
        };

        if(network == null)
        {
            setErrMsg("Select a Network")
            setLoading(false)
        }
        else if(pin == null)
        {
            setErrMsg("Enter PIN")
            setLoading(false)
        }
        else if(serialNumber == null)
        {
            setErrMsg("Enter Serial Number")
            setLoading(false)
        }
        else
        {
            fetch(urls.apiurl + 'admin/add_airtime_pin ', postOptions)
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setErrMsg(null)                    
                    setPin(null)
                    setSerialNumber(null)
                    setSuccessMsg(json.message)
                    getTransactions()
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

    useEffect(()=>{
        getTransactions()
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
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Add Airtime</h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">

                    
      <div>                        
                            
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
<label>PIN</label>
<input className='form-control' value={pin} onChange={e => {setPin(e.target.value); setCompanName_(e.target.value)}} />
</div>
</div>

<div class="col-xl-3 col-lg-6">
<div class="box">
<label>Serial Number</label>
<input className='form-control' type={"number"} value={serialNumber} onChange={e => setSerialNumber(e.target.value)}/>
</div>
</div>


<div class="col-xl-12 col-lg-12">
<div class="col-xl-3 col-lg-6">
<div class="box">
{errMsg != null? <ErrorMessage message={errMsg}/> : ''  }
{successMsg != null? <SuccessMessage message={successMsg}/> : ''  }
{isLoading? <LoadingImage /> :
<button onClick={()=>addAirtimeAction()} className='btn btn-primary'>Submit</button>
                            }

</div>
</div>
</div>

     </div>
</div>


<div className='row'>
<div class="table-responsive">
    <table className='table table-striped'>
        <tbody>
            <tr>
                <th colSpan={8}>
                    Recent Generated Airtime
                </th>
            </tr>
            <tr>
                            <td>Network</td>
                            <td>Amount</td>
                            <td>PIN</td>
                            <td>S/N</td>
                            <td>Creator</td>
                            <td>Used by</td>
                                <td>Status</td>
                                <td>Date </td>
                              </tr>
                              {transactions.map(tr =>
                              <tr>
                                <td>{tr.network}</td>
                                <td>
                                        <span class="mx-5">{NumberToNaira(tr.amount)}</span>
                                </td>
                                <td>{tr.pin}</td>
                                <td>{tr.serial_number}</td>
                                <td>{tr.created_by}</td>
                                <td>{tr.purchased_by}</td>
                                {tr.status === 0 ? <td class="text-end text-danger">Bought</td> : ''}
                                {tr.status === 1 ? <td class="text-end text-success">Available</td> : ''}
                                <td> {tr.created_at}  </td>
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
            
          </div>
      </section>
    </div>
</div>
<div class="control-sidebar-bg"></div>  
</div>
;

}

export default AddAirtimePin;

const style = {
    logo: {width: 50, heiht: 50}
};