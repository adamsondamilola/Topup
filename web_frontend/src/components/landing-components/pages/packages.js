import { Link } from "react-router-dom";
import FAQComponent from "../faq";
import PageTitleArea from "../pageTitleArea";
import NumberToNaira from "../../../constants/numberToNaira";

const Packages = () => {
    
    const packageData = [
        {id: 1, package: "Free Account", amount: 0, amtusd: 0, welcomeBonus: 0, Points: 0},
        {id: 1, package: "Discovery", amount: 5000, amtusd: 10, welcomeBonus: 600, Points: 20},
        {id: 3, package: "Bronze", amount: 10000, amtusd: 20, welcomeBonus: 1200, Points: 40},
        {id: 3, package: "Silver", amount: 20000, amtusd: 40, welcomeBonus: 2400, Points: 80},
        {id: 4, package: "Gold", amount: 30000, amtusd: 60, welcomeBonus: 3600, Points: 120},
        {id: 5, package: "Emerald", amount: 40000, amtusd: 80, welcomeBonus: 4800, Points: 160},
        {id: 6, package: "Platinum", amount: 50000, amtusd: 100, welcomeBonus: 6000, Points: 200},
        {id: 7, package: "Ex-Platinum", amount: 100000, amtusd: 200, welcomeBonus: 12000, Points: 400},
    ]; 

return(
    <>
    <PageTitleArea title="Packages and Pricing"/>

    <section class="pricing-area pt-100 pb-70">
			<div class="container">
				<div class="section-title">
					<span>Choose a plan</span>
					<h2>Our pricing plans</h2>
				</div>

				<div class="tab">
				
					<div class="tab_content">
						<div class="tabs_item">
							<div class="row justify-content-md-center">
                            {packageData.map(x =>
                                <div class="col-lg-4 col-md-6">
									<div class="single-pricing">
										<div class="pricing-title">
											<h3>{x.package}</h3>
											<h2>{NumberToNaira(x.amount)}</h2>
										</div>

										<ul>
											<li>
												<i class="ri-check-line"></i>
												<b>{NumberToNaira(x.welcomeBonus)}</b> Welcome Bonus 
											</li>
											<li>
												<i class="ri-check-line"></i>
												<b>{x.Points}</b> Points
											</li>
										</ul>

										<Link class="default-btn" to="/register">
											Sign Up
										</Link>
									</div>
								</div>
                            )}

								</div>
						</div>


					</div>
				</div>
			</div>

		</section>
        
            </>
)

}

export default Packages;