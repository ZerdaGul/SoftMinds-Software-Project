import React from 'react';
import { Link,  NavLink } from 'react-router-dom';

import earth from '../../assets/icons/earth.svg'
import user from '../../assets/icons/user.svg'
import logo from '../../assets/icons/logo.png'
import './Navbar.scss';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt='logo' style={{height:"90px", width: "auto"}}/> 
                </Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/aboutUs">About Us</NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/products">Products</NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/sectors">Sectors</NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/solutions">Solutions</NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/consultancy">Consultancy</NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/contactUs">Contact Us</NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/"> <img src={earth} alt='languages' style={{height:"20px", width: "auto"}}/> </NavLink></li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/profile"> <img src={user} alt='user' style={{height:"40px", width: "auto"}}/> </NavLink></li>

                {/* we must keep track on active session and if person loged in
                    then show correct link. maybe?????? */}
                {/* <li><Link to="/login">Log In</Link></li> */}
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : 'inherit'})}
                        to="/registration"> Log In </NavLink></li>
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

  