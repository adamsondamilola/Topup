import { render } from "react-dom";
import ContactForm from "../components/contactForm";
import PageTitleArea from "../components/pageTitleArea";
import SpaceDiv from "../components/spaceDiv";

const ContactUs = () => {    
return(
    <>
    <PageTitleArea title="Contact Us"/>
    <ContactForm/>
    </>
)

}

export default ContactUs;