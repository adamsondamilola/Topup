import { Link } from "react-router-dom";
import FAQComponent from "../faq";
import PageTitleArea from "../pageTitleArea";
import FormatNumber from "../../../constants/formatNumber";
import NumberToNaira from "../../../constants/numberToNaira";
import About from "../about";
import HowItWorks from "../howItWorks";
import OurServices from "../ourServices";

const AboutUs = () => {
   
return(
    <>
    <PageTitleArea title="About Us"/>

    <About/>
<HowItWorks/> 
<OurServices/>
        
            </>
)

}

export default AboutUs;