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
                    
                </div>
            </div>
        </div>
    </div>;
      }
}
