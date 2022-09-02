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

const BankAccount = () => {

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
            const [username, setUsername] = useState(null);
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
                    setUsername(json.result.username)
                    setBankName(json.bank.bank_name)
                    setAccountName(json.bank.account_name)
                    setAccountNumber(json.bank.account_number)
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
                        <h4 class="box-title">Bank Account 
                            </h4>
                      </div>
                      <div class="box-body pt-0">
                      
               {accountName !== null?       <div>
                          <div class="col-12 mt-3"> 
                      <div>Bank Name</div>
                     <h4>{bankName}</h4> 
                          </div>
                           
                          
                          <div class="col-12 mt-3"> 
                      <div>Account Number</div>
                     <h4>{accountNumber}</h4> 
                          </div>
                           
                          <div class="col-12 mt-3">
                          <div>Account Name</div>
                             <h4>{accountName}</h4>
                          </div>
</div>
     :
     <div class="col-12 mt-3 text-center">
     <Link to="/user/add_account" class="btn btn-success">
                                Add New +
                            </Link>
                            </div>
                            }
                                                       <div class="col-12 mt-3">  

                                 <div class="col-xl-12 col-12">
                 
              </div>

                                
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

export default BankAccount;

const style = {
    logo: {width: 45, heiht: 45}
};