import React from 'react';

import earth from '../../assets/earth.svg'
import user from '../../assets/user.svg'
import logo from '../../assets/logo.png'
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/">
                    <img src={logo} alt='logo' style={{height:"90px", width: "auto"}}/> 
                </a>
            </div>
            <ul className="navbar-links">
                <li><a href="/aboutUs">About Us</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/sectors">Sectors</a></li>
                <li><a href="/solutions">Solutions</a></li>
                <li><a href="/consultancy">Consultancy</a></li>
                <li><a href="/contactUs">Contact Us</a></li>
                <li><a href="/"> <img src={earth} alt='languages' style={{height:"20px", width: "auto"}}/> </a></li>
                <li><a href="/"> <img src={user} alt='user' style={{height:"40px", width: "auto"}}/> </a></li>
                <li><a href="/login">Log In</a></li>
            </ul>
            <div className="navbar-toggle">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;

  