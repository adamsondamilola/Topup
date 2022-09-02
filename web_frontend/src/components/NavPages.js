import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

const NavPages = () => {

	const [token, setToken] = useState(localStorage.getItem('loginToken'));

    let navPages = [
       {
            id: 1,
            path: '/faq',
            icon: "fa fa-question fa-2x",
            title: "FAQ",
            description: "Frequently Asked Questions"},
            {
                id: 2,
                path: '/packages',
                icon: "fa fa-th-large fa-2x",
                title: "Packages",
                description: "Packages and Pricing"},
                {
                    id: 3,
                    path: '/incentives',
                    icon: "fa fa-shopping-cart fa-2x",
                    title: "Incentives",
                    description: "Rewards and Points"},
                    {
                        id: 3,
                        path: '/contact',
                        icon: "fa fa-envelope fa-2x",
                        title: "Contact",
                        description: "Write to us"}
            
]

    return( 
        <section class="marketing-area pt-100 pb-70">
        <div class="container">
            <div class="section-title">
                <h2> <br/></h2>
            </div>
            <div class="row">
            {navPages.map(x =>
            <Link to={x.path}>
                
                <div class="col-lg-3 col-sm-6">
                    <div class="single-marketing-box icon-style bg-white">                    
                    <div class="input-group">
  <span class="input-group-text bg-white border-0"><i class={x.icon}></i> &nbsp;&nbsp; </span>
  <div className='col'>
  <h4> {x.title} </h4>
  <p>{x.description}</p>
  </div>
</div>   
                    </div>
                </div>
                </Link>
            )}
                          </div>
        </div>
    </section>
        );
}
export default NavPages