import React, { Component, useEffect, useState } from 'react';
import urls from '../../constants/urls';

const FAQComponent = () => {

    const [faqList, setFaqList] = useState([]);
    const getFAQ = () => {
      
        fetch(urls.apiurl +'general/faq')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    var x = json.result;
                    setFaqList(x)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => console.log("done"));
    }
  
    useEffect(()=>{
        getFAQ()
    },[])
  
  let questionsAndAnswers = [
        {id: 1,
        question: "What Is topupearn?",
    answer: "topupearn is a technology solution company that is leveraging on opportunities in local & global telecom sectors & digital economy.",
isActive: "active",
showAns: "show"},

{id: 2,
    question: "What is Our Mission?",
answer: "Our Mission is to empower dreams, create opportunities for financial freedom",
isActive: "",
showAns: ""},

{id: 3,
    question: "What is Our Vision",
answer: "Our Vision is to become a global brand technology company that will leverage on opportunities in telecom industry & digital economy in order to raise entrepreneurs through our cutting edge innovative products & services",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Digital economy refers to an economy that is based on digital computing technologies, but is often perceived as conducting business through markets based on the internetand the World Wide Web. It is also referred to as the Internet Economy, New Economy, or Web Economy",
isActive: "",
showAns: ""},

{id: 5,
    question: "What are our Services?",
answer: "✓ Recharge Pin, Mobile Printer\n"+
"✓ International Top Up\n"
+"✓ VTU (Airtime, Data, Dstv, Gotv, Startime, TSTV)\n"
+"✓ Education Pin (WAEC/JAMB)\n"
+"✓ Bill Payment (Electricity, Airline Ticket, ABC Transport, WakaNow, Hotel)\n" 
+"✓ Internet Subscription – topupearn Router, Spectranet, Smile\n"
+"✓ Skills Acquisition (Website Design, Digital Marketing etc).\n"
+"✓ Bulk SMS\n"
+"✓ Sending & Receiving Money\n"
+"✓ POS Hardware\n"
+"✓ Loan Application",
isActive: "",
showAns: ""},
/*
{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""},

{id: 4,
    question: "What is Digital Economy?",
answer: "Ansewe",
isActive: "",
showAns: ""} 
*/
    ]
    // State to show/hide accordion
const [selectedId, setSelectId] = useState(1);

//const [faqList, setFaqList] = useState(questionsAndAnswers);

function selectQuestion(id){
    setSelectId(id)
}

        return <section class="faq-area bg-color-e9f7fe ptb-100">
        <div class="container">
            <div class="faq-accordion">
                <ul class="accordion">
                  {faqList.map(x =>
                    <li onClick={() => selectQuestion(x.id)} class="accordion-item">
                        <a className={"accordion-title"} href="javascript:void(0)">
                            <i class="fa fa-circle"></i>
                            <h3 class="font-weight-bold mb-0">{x.question}</h3>
                        </a>
                        <div style={{display: selectedId == x.id? `block` : `none` }} className={"accordion-content"}>
                            <div className='col-12 m-10'>
                            <p>{x.answer}</p>
                            </div>
                        </div>
                    </li>
                    )}
</ul>

            </div>
        </div>
    </section>;
      
}
export default FAQComponent