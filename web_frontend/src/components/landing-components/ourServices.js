import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import images from '../../constants/images';

//const [services, setServices] = useState([]);

const services = [
    {
        id: 1,
        service: "MTN",
        img: images.mtn 
    },
    {
        id: 2,
        service: "GLO",
        img: images.glo 
    },
    {
        id: 3,
        service: "AIRTEL",
        img: images.airtel 
    },
    {
        id: 4,
        service: "9Mobile",
        img: images.nmobile 
    },
    {
        id: 5,
        service: "DSTV",
        img: images.dstv 
    },
    {
        id: 6,
        service: "GOTV",
        img: images.gotv 
    },
    {
        id: 7,
        service: "StartTimes",
        img: images.startimes 
    },
    {
        id: 8,
        service: "EKEDC",
        img: images.ekedc 
    },
    {
        id: 9,
        service: "IKEDC",
        img: images.ikedc 
    },
    {
        id: 10,
        service: "PHEDC",
        img: images.phedc 
    },
    {
        id: 11,
        service: "AEDC",
        img: images.aedc 
    },
    {
        id: 12,
        service: "KEDC",
        img: images.kedc 
    },
    {
        id: 13,
        service: "KDEDC",
        img: images.kdedc 
    },
    {
        id: 14,
        service: "IBEDC",
        img: images.ibedc 
    },
    {
        id: 15,
        service: "JEDC",
        img: images.jedc 
    },
    {
        id: 16,
        service: "EEDC",
        img: images.eedc 
    },
    {
        id: 17,
        service: "BULK SMS",
        img: images.bulksms 
    },
    {
        id: 18,
        service: "VOICE SMS",
        img: images.voicesms 
    },
]
    
const OurServices = () => {

    return <section class="section bg-light" id="services">
        <div class="container">
          
            <div class="row">
			<div class="col-lg-12">
			<div class="text-center section_title">
            <h3 class="font-weight-bold mb-0">Services</h3>
            <div class="section_title_border">
<div class="f-border"></div>
<div class="f-border"></div>
<div class="s-border"></div>
<div class="f-border"></div>
<div class="f-border"></div>
</div>
            </div>
            </div>
            {services.map(x =>
                <div class="col-lg-3 col-md-6  mt-5">
                    <div class="single-services-box-wrap">
                    <Link to={'/user/dashboard'}>  <div class="single-services box card-bg top-content">
                       <img src={x.img} height={100} />
                        </div>  
                        </Link>                    
                    </div>
                </div>
    )}

</div> 
            </div>
    </section>;
      }
      export default OurServices;
