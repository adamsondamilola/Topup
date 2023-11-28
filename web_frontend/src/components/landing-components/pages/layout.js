import About from "../about";
import Copyright from "../copyright";
import Footer from "../footer";
import TopHeader from "../top_header";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {    
return <>
<TopHeader/>
<Outlet/>
<Footer/>
</>

}

export default Layout;