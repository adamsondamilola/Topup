import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class About extends Component {
    render() {
        return <section class="about-us-area pb-70">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-lg-5 justify-content-center text-center mb-5">
					<i class="fa fa-trophy" style={{fontSize: 100, color: "#20c997"}}></i>
					<h3>REFER & EARN</h3>
							<p>Invite a friend to sign up and earn instant bonus on package sign-up fee. Please, see our <Link to={"/faq"}>frequently asked question</Link> for more details</p>
					</div>

					<div class="col-lg-7">
						<div class="about-content about-content-style-two">
						<h3><b>MISSION</b></h3>
							<h2>To make Topup services easily accessible and create job opportunities for people of all ages irrespective location with small capital</h2>
							
<div class="row mb-10"><br/></div>
							
						</div>
					</div>
				</div>
			</div>
		</section>;
      }
}
