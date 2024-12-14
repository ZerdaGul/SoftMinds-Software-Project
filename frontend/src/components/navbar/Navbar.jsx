import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import earth from '../../assets/icons/earth.svg';
import user from '../../assets/icons/user.svg';
import logo from '../../assets/icons/logo.png';
import bellIcon from '../../assets/icons/bell.png'; // Bildirim ikonu
import './Navbar.scss';
import { LogOut } from '../../services/AuthService';
import ConfirmModal from '../modals/ConfirmModal';
import NotificationModal from '../modals/NotificationModal'; // Bildirim modalı

const Navbar = ({ isLoggedIn, setIsLoggedIn, onLogout, activeUser }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false); // Bildirim modalı kontrolü
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menü durumu

    // Çıkış işlemi
    const handleLogout = async () => {
        try {
            const response = await LogOut(); // Backend çıkış işlemi
            setIsLoggedIn(false);
            localStorage.removeItem('current-user');
            setShowLogoutModal(false);
            onLogout();
            alert(response.message);
            navigate('/login');
        } catch (error) {
            console.error("Çıkış işlemi sırasında hata oluştu:", error);
        }
    };

    const confirmLogout = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);

    // Bildirim modalını açma
    const openNotificationModal = () => setShowNotificationModal(true);
    const closeNotificationModal = () => setShowNotificationModal(false);

    const lowStockProducts = [];

    const renderNotificationButton = () => {
        if (true) {
            return (
                <li>
                    <button className="navbar-notification" onClick={openNotificationModal}>
                        <img src={bellIcon} alt="Notifications" />
                        {lowStockProducts?.length > 0 && (
                            <span className="notification-badge">{lowStockProducts.length}</span>
                        )}
                    </button>
                </li>
            );
        }
        return null;
    };

    // Hamburger menüyü açma/kapatma
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Linke tıklandığında menüyü kapatma
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="logo" style={{ height: "90px", width: "auto" }} />
                </Link>
            </div>
            <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/aboutUs"
                        onClick={handleLinkClick}
                    >
                        About Us
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/products"
                        onClick={handleLinkClick}
                    >
                        Products
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/sectors"
                        onClick={handleLinkClick}
                    >
                        Sectors
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/solutions"
                        onClick={handleLinkClick}
                    >
                        Solutions
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/consultancy"
                        onClick={handleLinkClick}
                    >
                        Consultancy
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to={activeUser ? "/contactUs": "/unauthorized"}
                        onClick={handleLinkClick}
                    >
                        Contact Us
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/faq"
                        onClick={handleLinkClick}
                    >
                        FAQ
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/"
                        onClick={handleLinkClick}
                    >
                        <img src={earth} alt="languages" style={{ height: "20px", width: "auto" }} />
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to={activeUser ? "/profile": "/unauthorized"}
                        onClick={handleLinkClick}
                    >
                        <img src={user} alt="user" style={{ height: "40px", width: "auto" }} />
                    </NavLink>
                </li>
                {renderNotificationButton()}
                <li>
                    {isLoggedIn ? (
                        <Link onClick={() => { confirmLogout(); handleLinkClick(); }}>Log Out</Link>
                    ) : (
                        <NavLink to="/login" onClick={handleLinkClick}>Log In</NavLink>
                    )}
                </li>
            </ul>
            <div className="navbar-toggle" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            {showLogoutModal &&
                createPortal(
                    <ConfirmModal
                        title={"Do you want to log out?"}
                        buttonConfirmText={"Yes"}
                        buttonCloseText={'No'}
                        onClose={closeLogoutModal}
                        onConfirm={handleLogout} />,
                    document.body
                )}

            {showNotificationModal &&
                createPortal(
                    <NotificationModal
                        lowStockProducts={lowStockProducts}
                        onClose={closeNotificationModal}
                    />,
                    document.body
                )}
        </nav>
    );
};

export default Navbar;
