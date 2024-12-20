import React, { Component, useEffect, useState } from 'react';
import About from "../components/about";
import Copyright from "../components/copyright";
import Footer from "../components/footer";
import HowItWorks from "../components/howItWorks";
import OurServices from "../components/ourServices";
import Slider from "../components/slider";
import TopHeader from "../components/top_header";

const Home = () => {   
    useEffect(()=>{
       window.location.href="/login"; 
    });

return <>
<Slider/>
<HowItWorks/> 
<About/>
<OurServices/>
</>

}

export default Home;