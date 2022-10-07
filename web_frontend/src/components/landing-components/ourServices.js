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
    
export default class OurServices extends Component {
    render() {
        return <section class="services-area bg-color-e9f7fe pt-100 pb-70">
        <div class="container">
            <div class="section-title section-title-mb">
               
                <h2>Get Amazing Discount</h2>
            </div>

            <div class="row">
            {services.map(x =>
                <div class="col-lg-3 col-md-6">
                    <div class="single-services-box-wrap">
                        <div class="single-services box card-bg top-content">
                        <img src={x.img} />
                            <h3>
                                <a href="services-details.html">{x.service}</a>
                            </h3>
                            <p> <div class="shape shape-1">
        </div></p>
                        </div>

                        <div class="single-services box card-bg bg-2 bottom-content">
                            <h3>
                                <a href="#">{x.service}</a>
                            </h3>
                            <p>Click the button below for this service.</p>

                            <Link to="/user/dashboard" class="default-btn">
                                Continue
                            </Link>
                        </div>
                    </div>
                </div>
    )}

            </div>
        </div>
    </section>;
      }
}
