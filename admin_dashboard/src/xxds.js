
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Routes,
  Route
} from "react-router-dom";

import Home from './pages/home';

function App() {
  return (
    <Router>
        <div className="App">
         <ul className="App-header">
           <li>
             <Link to="/">Home</Link>
           </li>
           <li>
             <Link to="/about">About Us</Link>
           </li>
           <li>
             <Link to="/contact">Contact Us</Link>
           </li>
         </ul>
        <Routes>
              <Route exact path='/' element={< Home />}></Route>
       </Routes>
       </div>
    </Router>
);

}

function Homex() {
  return  <ul>
  <li>
    <Link to="/">Home</Link>
  </li>
  <li>
    <Link to="/about">About Us</Link>
  </li>
  <li>
    <Link to="/contact">Contact Us</Link>
  </li>
</ul>;
}


export default App;
