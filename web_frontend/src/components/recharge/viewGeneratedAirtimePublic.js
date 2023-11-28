import React, { Component, forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import logos from '../../constants/logos';

const ViewGeneratedAirtimePublic = () => {

    const {id} = useParams();
    const {token} = useParams();

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
   
    const [isLoading, setLoading] = useState(false);
    const [companyName, setCompanyName] = useState(localStorage.getItem('companyName'));
    
    let ref = useRef();
    const ComponentToPrint = forwardRef((props, ref) => {
        return <div className='row' ref={ref}>
                
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

    const [cardDetails, setCardDetails] = useState([])
    const [cardDetails_, setCardDetails_] = useState([])
    const getAirtimePrintDetails = () => {
        setLoading(true)
                fetch(urls.apiurl +'recharge/'+ token+'/'+id+'/get_airtime_details_public/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                   let x = json.result.json_data
                   setCardDetails(x)
                   setCardDetails_(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{

        getAirtimePrintDetails()

    },[])


    return <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full">
      <section class="content">
           <div class="row">
              <div class="col-xl-12 col-12">
                  <div class="box position-static">
                      <div class="box-header">
                          <h4 class="box-title">Airtime</h4>
                          </div>
                      <div class="box-body">
                          <div class="row mb-20">


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

export default ViewGeneratedAirtimePublic;

const style = {
    logo: {width: 50, heiht: 50}
};