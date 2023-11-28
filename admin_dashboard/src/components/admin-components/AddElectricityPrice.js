import React, { Component, useEffect, useState } from 'react';

import urls from '../../constants/urls';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import ErrorMessage from '../../utilities/errorMessage';

const AddElectricityPrices = () => {

   
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);

const [product, setProduct] = useState(null);
const [productCode, setProductCode] = useState(null);
const [transactionCharges, setTransactionCharges] = useState(null);

    const addAction = () =>{
        setErrMsg(null)
        setLoading(true)
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                product: product,
                product_code: productCode,
                transaction_charges: transactionCharges,
                login_token: token
             })
        };
    
        fetch(urls.apiurl + 'admin/add-electricity-price', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setErrMsg(null)
                            setLoading(false)
                           setSuccessMsg(json.message);
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
                        <h4 class="box-title">Add Electricity </h4>
                      </div>
                      <div class="box-body pt-0">
                      <div class="table-responsive">
                            <table class="table mb-0 table-striped">

                                <tbody>
                                <tr>
                                        <th>Company Name </th>
                                        <td>
                                            <input 
                                    onChange={e => setProduct(e.target.value)} 
                                    value={product}
                                    class="form-control" 
                                    type="text" />
                                    </td>
                                    </tr>
                                    <tr>
                                        <th>Code</th> 
                                        <td><input className='form-control' value={productCode} 
                                         onChange={e => setProductCode(e.target.value)} 
                                         /></td>
                                    </tr>
                                    <tr>
                                        <th>Transaction Charges</th>
                                        <td><input className='form-control' value={transactionCharges} 
                                         onChange={e => setTransactionCharges(e.target.value)} 
                                        /></td>
                                    </tr>
                                </tbody>
                                </table>
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
                                <button class="btn btn-primary" onClick={() => addAction()} type="button">
                                Add New 
                            </button>
                            }
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

export default AddElectricityPrices;

const style = {
    logo: {width: 45, heiht: 45}
};