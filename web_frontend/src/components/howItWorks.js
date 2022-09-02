import React, { Component } from 'react';
export default class HowItWorks extends Component {
    render() {
        return (
            <section class="marketing-area pt-100 pb-70">
			<div class="container">
				<div class="section-title">
					<h2>How it works</h2>
				</div>
				<div class="row">
					<div class="col-lg-3 col-sm-6">
						<div class="single-marketing-box icon-style">
						<i class="fa fa-user-plus" style={{fontSize: 100, color: "#20c997"}}></i>
							<h3>CREATE AN ACCOUNT</h3>
							<p>At the top of website page or nav menu, click Register or Login if you already have one. 
								Its easy to own an account</p>
						</div>
					</div>

					<div class="col-lg-3 col-sm-6">
						<div class="single-marketing-box icon-style">
						<i class="fa fa-university" style={{fontSize: 100, color: "#20c997"}}></i>
							<h3>FUND YOUR WALLET</h3>
							<p>Fund your wallet using any of these convenient payment methods. 
								Mobile Transfer, online Payment.</p>
						</div>
					</div>

					<div class="col-lg-3 col-sm-6">
						<div class="single-marketing-box icon-style">
						<i class="fa fa-shopping-cart" style={{fontSize: 100, color: "#20c997"}}></i>
						<h3>PLACE YOUR ORDER</h3>
							<p>All orders are processed immediately ,All Recharge and Bill payment services vended will be delivered immediately.</p>
						</div>
					</div>

					<div class="col-lg-3 col-sm-6">
						<div class="single-marketing-box icon-style">
						<i class="fa fa-money" style={{fontSize: 100, color: "#20c997"}}></i>
							<h3>INSTANT CASH-BACK</h3>
							<p>After successful transaction, CashBack Value will be sent to your CashBack wallet, and its withdrawable at any time.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
            );
      }
}
