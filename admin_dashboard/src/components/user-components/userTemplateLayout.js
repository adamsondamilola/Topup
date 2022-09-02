import { Outlet, Link } from "react-router-dom";
import DashbaordHeader from "./header";
import DashbaordFooter from "./footer";
import SideBar from "./sidebar";

const UserTemplateLayout = () => {    
return <body class="hold-transition light-skin sidebar-mini theme-primary fixed">
	
<div class="wrapper">
<DashbaordHeader/>
<SideBar/>
<Outlet/>
<DashbaordFooter/>
</div>
</body>

}

export default UserTemplateLayout;