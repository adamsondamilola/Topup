import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class DashbaordFooter extends Component {
    render() {
        return  <footer class="main-footer">
        <div class="pull-right d-none d-sm-inline-block">
            <ul class="nav nav-primary nav-dotted nav-dot-separated justify-content-center justify-content-md-end">
              <li class="nav-item">
                <Link class="nav-link" to="/faq">FAQ</Link>
              </li>
            </ul>
        </div>
          &copy; 2022 <a href="/"></a> All Rights Reserved.
      </footer>
    ;
      }
}
