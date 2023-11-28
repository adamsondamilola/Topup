import { Link } from "react-router-dom";
import FAQComponent from "../faq";
import PageTitleArea from "../pageTitleArea";
import FormatNumber from "../../../constants/formatNumber";
import NumberToNaira from "../../../constants/numberToNaira";

const Incentives = () => {
    
    const packageData = [
        {id: 1, amount: 50000, amtusd: 0, incentive: "Smartphone or 3 mobile printers ", Points: 5000},
        {id: 2, amount: 100000, amtusd: 0, incentive: "Laptop or 5 mobile printers", Points: 10000},
        {id: 3, amount: 500000, amtusd: 0, incentive: "A Plot Of Land worth N600k or Trip", Points: 25000},
        {id: 4, amount: 2000000, amtusd: 0, incentive: "A Plot Of Land Worth N1m + Int’l Trip", Points: 60000, eligible: "Eligible To Enrol For Lexus Car RX 330/350 & House Scheme Programme"},
        {id: 5, amount: 3000000, amtusd: 0, incentive: "3 Bedroom Bungalow", Points: 100000, eligible: "Eligible To Enrol For Lexus Car RX 330/350 & House Scheme Programme"},
        {id: 6, amount: 4500000, amtusd: 0, incentive: "3 Bedroom Bungalow", Points: 250000, eligible: "Eligible To Enrol For Lexus Car RX 330/350 & House Scheme Programme"},
        {id: 7, amount: 7000000, amtusd: 0, incentive: "3 Bedroom Bungalow", Points: 500000},
        {id: 8, amount: 8500000, amtusd: 0, incentive: "3 Bedroom Bungalow", Points: 1000000},
        {id: 9, amount: 0, amtusd: 0, incentive: "Quarterly Sales Pool Bonus Or Profit Sharing (Products)", Points: 2000000},
    ]; 

return(
    <>
    <PageTitleArea title="Incentives"/>

    <section class="pricing-area pt-100 pb-70">
			<div class="container">
			
				<div class="tab">
				
					<div class="tab_content">
						<div class="tabs_item">
							<div class="row table-responsive">
                                <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                        <th>Required Points</th>
                                        <th>Prize</th>
                                        <th>or Cash</th>
                                        </tr>
                                        {packageData.map(x =>
                                <tr>
                                    <td>{FormatNumber(x.Points)}</td>
                                    <td>{x.incentive}</td>
                                    <td>{NumberToNaira(x.amount)}</td>
                                </tr>
                                )}
                                    </tbody>
                                </table>
                            

								</div>
						</div>


					</div>
				</div>
			</div>

		</section>
        
            </>
)

}

export default Incentives;