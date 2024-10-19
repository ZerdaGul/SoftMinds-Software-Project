import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/"><img src="/components/logo.png" style={{height:"90px", width: "auto"}}/> </a>
            </div>
            <ul className="navbar-links">
                <li><a href="/aboutUs">About Us</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/sectors">Sectors</a></li>
                <li><a href="/solutions">Solutions</a></li>
                <li><a href="/consultancy">Consultancy</a></li>
                <li><a href="/contactUs">Contact Us</a></li>
                <li><a href="/"> <img src="/components/earth.png" style={{height:"20px", width: "auto"}}/> </a></li>
                <li><a href="/"> <img src="/components/user.png" style={{height:"40px", width: "auto"}}/> </a></li>
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

  