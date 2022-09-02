import { Link } from "react-router-dom";
import SpaceDiv from "./spaceDiv";

const PageTitleArea = (props) => {   
    
    document.title = props.title; 
    return(
        <>
        <SpaceDiv/>
        <div class="page-title-area bg-8">
        <div class="container">
            <div class="page-title-content">
                <h2>{props.title}</h2>
    
                <ul>
                    <li>
                        <Link to="/">
                            Home 
                        </Link>
                    </li>
    
                    <li class="active">{props.title}</li>
                </ul>
            </div>
        </div>
    </div>
    </>
    )
    
    }
    
    export default PageTitleArea;