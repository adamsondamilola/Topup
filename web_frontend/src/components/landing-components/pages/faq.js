import FAQComponent from "../faq";
import PageTitleArea from "../pageTitleArea";

const FAQ = () => {    
return(
    <section class="section bg-light" id="faq">
<div class="container">
<div class="row">
<div class="col-lg-12">
<div class="text-center section_title">
<p class="sec_small_title text-custom font-weight-bold mb-1">Frequently Asked Questions</p>
<h3 class="font-weight-bold mb-0">Find answers to your questions</h3>
<div class="section_title_border">
<div class="f-border"></div>
<div class="f-border"></div>
<div class="s-border"></div>
<div class="f-border"></div>
<div class="f-border"></div>
</div>
</div>
</div>

<FAQComponent/>

</div>
</div>
</section>
    
)

}

export default FAQ;