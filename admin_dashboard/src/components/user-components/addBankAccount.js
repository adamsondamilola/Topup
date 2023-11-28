import React, { Component, useEffect, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link } from 'react-router-dom';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const AddBankAccount = () => {

    const nigeriaBanks = [
        {id: 1,
            bank: "Access Bank",
            code: "044"
        },
        {id: 2,
            bank: "Access Bank (Diamond)",
            code: "063"
        },
        {id: 3,
            bank: "ALAT by WEMA",
            code: "035A"
        },
        {id: 4,
            bank: "ASO Savings and Loans",
            code: "401"
        },
        {id: 5,
            bank: "Bowen Microfinance Bank",
            code: "50931"
        },
        {id: 6,
            bank: "CEMCS Microfinance Bank",
            code: "50823"
        },
        {id: 7,
            bank: "Citibank Nigeria",
            code: "023"
        },
        {id: 8,
            bank: "Ecobank Nigeria",
            code: "050"
        },
        {id: 9,
            bank: "Ekondo Microfinance Bank",
            code: "562"
        },
        
        {id: 10, bank: "Eyowo", code: "50126"},
        {id: 11, bank: "Fidelity Bank", code: "070"},
        {id: 12, bank: "First Bank of Nigeria", code: "011"},
        {id: 13, bank: "First City Monument Bank", code: "214"},
        {id: 14, bank: "FSDH Merchant Bank Limited", code: "501"},
        {id: 15, bank: "Globus Bank", code: "00103"},
        {id: 16, bank: "Guaranty Trust Bank", code: "058"},
        {id: 17, bank: "Hackman Microfinance Bank", code: "51251"},
        {id: 18, bank: "Hasal Microfinance Bank", code: "50383"},
        {id: 19, bank: "Heritage Bank", code: "030"},
        {id: 20, bank: "Ibile Microfinance Bank", code: "51244"},
        {id: 21, bank: "Jaiz Bank", code: "301"},
        {id: 22, bank: "Keystone Bank", code: "082"},
        {id: 23, bank: "Kuda Bank", code: "50211"},
        {id: 24, bank: "Lagos Building Investment Company Plc.", code: "90052"},
        {id: 25, bank: "One Finance", code: "565"},
        {id: 26, bank: "Parallex Bank", code: "526"},
        {id: 27, bank: "Parkway - ReadyCash", code: "311"},
        {id: 28, bank: "Polaris Bank", code: "076"},
        {id: 29, bank: "Providus Bank", code: "101"},
        {id: 30, bank: "Rubies MFB", code: "125"},
        {id: 31, bank: "Sparkle Microfinance Bank", code: "51310"},
        {id: 32, bank: "Stanbic IBTC Bank", code: "221"},
        {id: 33, bank: "Standard Chartered Bank", code: "068"},
        {id: 34, bank: "Sterling Bank", code: "232"},
        {id: 35, bank: "Suntrust Bank", code: "100"},
        {id: 36, bank: "TAJ Bank", code: "302"},
        {id: 37, bank: "TCF MFB", code: "51211"},
        {id: 38, bank: "Titan Bank", code: "102"},
        {id: 39, bank: "Union Bank of Nigeria", code: "032"},
        {id: 40, bank: "United Bank For Africa", code: "033"},
        {id: 41, bank: "Unity Bank", code: "215"},
        {id: 42, bank: "VFD", code: "566"},
        {id: 43, bank: "Wema Bank", code: "035"},
        {id: 44, bank: "Zenith Bank", code: "057"}
    ]

   
    const [userData, setUserData] = useState([]);


            const [bankName, setBankName] = useState(null);
            const [accountName, setAccountName] = useState(null);
            const [accountNumber, setAccountNumber] = useState(null);
            const [bankCode, setBankCode] = useState(null);
            const [username, setUsername] = useState(null);
            const [accountVerified, setAccountVerified] = useState(false);
            const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState(null);
const [lastName, setLastName] = useState(null);
const [phone, setPhone] = useState(null);


    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setUsername(json.result.username)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const verifyBankAccount = (bank_code, account_number) =>{
        setErrMsg(null)
        setLoading(true)

        var data = nigeriaBanks.filter((obj => obj.code == bank_code));
        setBankName(data[0].bank);
    
        fetch(urls.apiurl +'user/'+token+'/'+account_number+'/'+bank_code+'/verify_bank_account')
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                            setAccountName(json.account_name)
                            setAccountNumber(json.account_number)
                            setAccountVerified(true)
                           //setSuccessMsg(json.message);

                }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }    
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }

    const addBankAccount = () =>{
        setErrMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            bank_name: bankName,
            bank_code: bankCode,
            account_name: accountName,
            account_number: accountNumber,
            username : username
             })
        };
    
        fetch(urls.apiurl + 'user/add_bank_account', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            window.location.href="/user/bank_account";
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
                        <h4 class="box-title">Add Bank Account</h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="col-12 mt-3">
                          <select 
onChange={e => setBankCode(e.target.value) } 
className='form-control'>
    <option>Select Bank</option>
    {nigeriaBanks.map(y =>
    <option value={y.code}>{y.bank}</option>
    )}
    </select>
                          </div>
                      <div class="col-12 mt-3"> 
                      <input 
                                    onChange={e => setAccountNumber(e.target.value)} 
                                    value={accountNumber}
                                    class="form-control" 
                                    placeholder='Enter Account Number'
                                    type="tel"/>
                          </div>
                           
                          <div class="col-12 mt-3">
                             <h4>{accountName}</h4>
                          </div>

                                <div class="col-12 mt-3">  

                                 <div class="col-xl-12 col-12">
                  {successMsg != null? <div class="col-xl-12 col-lg-12">
          <div class="box-body text-center">
              <SuccessMessage message={successMsg}/>
              </div>
              </div>
               : null  }

{errMsg != null? <ErrorMessage message={errMsg}/> : null  }
              </div>

                                {isLoading? <LoadingImage /> :
                                !accountVerified ?
                                <button class="btn btn-primary" onClick={() => verifyBankAccount(bankCode, accountNumber)} type="button">
                                Add Bank Account
                            </button>
                            :
                                <button class="btn btn-success" onClick={() => addBankAccount()} type="button">
                                Confirm Account
                            </button>
                            
                            }
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

export default AddBankAccount;

const style = {
    logo: {width: 45, heiht: 45}
};