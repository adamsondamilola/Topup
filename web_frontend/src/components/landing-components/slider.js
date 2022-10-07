import React, { Component, useState } from 'react';
import { useEffect } from 'react';
import ReactPlayer from 'react-player'
import urls from '../../constants/urls';
//import urls from '../constants/urls';



//export default class Slider extends Component {
    const Slider = () => {   
    const [playVideo, setPlayVideo] = useState(false);

    const [title, setTitle] = useState(null);

    const websiteSettings = () => {
        
        fetch(urls.apiurl +'admin/website_settings')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    var x = json.result;
                    setTitle(x.title)

                    }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }

    useEffect(()=>{
        websiteSettings()
    },[])

    if(playVideo){
        
        return <div><br/><br/><br/><br/><br/><br/>
           <ReactPlayer url={require("../../videos/recharge_card_rate.mp4")}
            width='100%'
            playing={true} />
           </div>;
       }


       else{

        return <section className="hero-slider-area">
        <div className="hero-slider owl-theme"  data-slider-id="1">
            <div className="hero-slider-item">
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-7">
                                    <div className="hero-slider-content text-white">
                                        <h1 className="text-white">Welcome to {title}</h1>
                                        <h4 className="text-white">Earn huge commission as a paypoint vendor </h4><br/>
                                        <p className="text-white">Leverage on opportunities in local & global telecom sectors & digital economy.</p>
            
                                        <div className="slider-btn">
                                      
                                            <div onClick={() => setPlayVideo(true)} className="popup-youtube play-video">
                                                <i className="flaticon-play-button"></i>
                                                <span className="text-white">Play video</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
        
                                <div className="col-lg-5">
                                    <div className="slider-img">
                                        <img src="assets/images/slider/app.jpg" alt="Image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
        </section>
       }
       // {playVideo ? <VideoView/> : <SliderView /> }

}
export default Slider;