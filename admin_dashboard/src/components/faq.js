import React, { Component, useState } from 'react';

const FAQComponent = () => {

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
const [show, setShow] = useState(false);

const [faqList, setFaqList] = useState(questionsAndAnswers);

function selectQuestion(id){
    var objIndex2 = questionsAndAnswers.findIndex((obj => obj.id != parseInt(id)));
    questionsAndAnswers[objIndex2].isActive = "";
    questionsAndAnswers[objIndex2].showAns = "";
    var objIndex = questionsAndAnswers.findIndex((obj => obj.id == parseInt(id)));
    questionsAndAnswers[objIndex].isActive = "active";
    questionsAndAnswers[objIndex].showAns = "show";
    setFaqList(JSON.parse(JSON.stringify(questionsAndAnswers)));
    //setSelectPackage(true)
    //get selected details
var data = questionsAndAnswers.filter((obj => obj.id == parseInt(id)));

}

        return <section class="faq-area bg-color-e9f7fe ptb-100">
        <div class="container">
            <div class="section-title">
                <h2>Find answers to your questions</h2>
            </div>

            <div class="faq-accordion">
                <ul class="accordion">
                  {faqList.map(x =>
                    <li onClick={() => selectQuestion(x.id)} class="accordion-item">
                        <a className={"accordion-title"} href="javascript:void(0)">
                            <i class="ri-add-line"></i>
                            {x.id}) {x.question}
                        </a>

                        <div className={"accordion-content" +x.showAns}>
                            <div className='col-12 m-10'>
                            <p>{x.answer}</p>
                            </div>
                        </div>
                    </li>
                    )}
</ul>

                <div class="shape shape-1">
                    <img src="assets/images/faq-shape.png" alt="Image" />
                </div>
                <div class="shape shape-2">
                    <img src="assets/images/faq-shape.png" alt="Image" />
                </div>
            </div>
        </div>
    </section>;
      
}
export default FAQComponent