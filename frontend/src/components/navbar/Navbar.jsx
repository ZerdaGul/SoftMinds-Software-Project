import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import earth from '../../assets/icons/earth.svg'
import user from '../../assets/icons/user.svg'
import logo from '../../assets/icons/logo.png'
import './Navbar.scss';

const Navbar = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('authToken'); // Kullanıcının giriş yapıp yapmadığını kontrol et

    const handleLogout = () => {
        // Oturum kapatma işlemi (örneğin, token'ı temizleme)
        localStorage.removeItem('authToken');
        navigate('/login'); // Çıkış yaptıktan sonra giriş sayfasına yönlendir
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="logo" style={{ height: "90px", width: "auto" }} />
                </Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/aboutUs">About Us</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/products">Products</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/sectors">Sectors</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/solutions">Solutions</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/consultancy">Consultancy</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/contactUs">Contact Us</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/"> <img src={earth} alt="languages" style={{ height: "20px", width: "auto" }} /> </NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                             to="/profile"> <img src={user} alt="user" style={{ height: "40px", width: "auto" }} /> </NavLink>
                </li>
                <li>
                    {
                        isLoggedIn ? (
                            <button onClick={handleLogout} className="logout-button">
                                Log Out
                            </button>
                        ) : (
                            <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : 'inherit' })}
                                     to="/login"> Log In </NavLink>
                        )
                    }
                </li>
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

