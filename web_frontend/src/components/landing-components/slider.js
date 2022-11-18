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

        return <section class="home-bg h-100vh" id="home">
        <div class="bg-overlay"></div>
        <div class="home-table">
        <div class="home-table-center">
        <div class="container">
        <div class="row">
         <div class="col-lg-12">
        <div class="text-white text-center">
        <div class="small_title">
        <span>Topup Earn</span>
        </div>
        <h1 class="header_title mx-auto mt-4 mb-0 font-weight-bold"><div class="simple-text-rotate">Premium VTU Services.</div></h1>
        <p class="header_subtitle mx-auto pt-4 mb-0 pb-2 text-white">Take advantage of our quality VTU services and get returns on every transactions.</p>
        <div class="header_btn mt-3">
        <a href="/login" class="btn btn-custom mr-3">Get Started</a>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </section>
       }

}
export default Slider;