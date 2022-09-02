import About from "../components/about";
import Copyright from "../components/copyright";
import Footer from "../components/footer";
import HowItWorks from "../components/howItWorks";
import OurServices from "../components/ourServices";
import Slider from "../components/slider";
import TopHeader from "../components/top_header";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {    
return <>
<TopHeader/>
<Outlet/>
<Footer/>
</>

}

export default Layout;