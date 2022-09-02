import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

  export default class Copyright extends Component {
    render() {
        return <div class="copy-right-area bg-color">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <p>
                        Copyright <i class="ri-copyright-line"></i> 2022 topupearn.com
                    </p>
                </div>
                <div class="col-lg-6">
                    <ul>
                        <li>
                            <Link to="/privacy-policy">Privacy policy</Link>
                        </li>
                        <li>
                            <Link to="/terms-conditions">Terms conditions</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>;
      }
}
