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

    // Çıkış işlemi
    const handleLogout = async () => {
        try {
            await LogOut(); // Backend çıkış işlemi
            setIsLoggedIn(false);
            localStorage.removeItem('current-user');
            setShowLogoutModal(false);
            onLogout();
            navigate('/login'); // Giriş sayfasına yönlendir
        } catch (error) {
            console.error("Çıkış işlemi sırasında hata oluştu:", error);
        }
    };

    const confirmLogout = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);

    // Bildirim modalını açma
    const openNotificationModal = () => setShowNotificationModal(true);
    const closeNotificationModal = () => setShowNotificationModal(false);

    const lowStockProducts=[];

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


    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="logo" style={{ height: "90px", width: "auto" }} />
                </Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to="/aboutUs">About Us</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to="/products">Products</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to="/sectors">Sectors</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to="/solutions">Solutions</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to="/consultancy">Consultancy</NavLink>
                </li>
                <li>
                    {activeUser?.role === "padmin" || activeUser?.role === "oadmin" ? null :
                        <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to={activeUser ? "/contactUs": "/unauthorized"}>Contact Us</NavLink>
                             }
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/faq">FAQ</NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                        to="/"> <img src={earth} alt="languages" style={{ height: "20px", width: "auto" }} />
                    </NavLink>
                </li>
                <li>
                    
                    <NavLink style={({ isActive }) => ({ color: isActive ? '#FF5733' : '#571846' })}
                             to={activeUser ? "/profile": "/unauthorized"}> <img src={user} alt="user" style={{ height: "40px", width: "auto" }} />
                    </NavLink>
                </li>
                {/* Bildirim butonu */}
                {renderNotificationButton()}
                {/* Kullanıcı giriş/çıkış */}
                <li>
                    {isLoggedIn && activeUser ? (
                        <Link onClick={confirmLogout}>Log Out</Link>
                    ) : (
                        <NavLink to="/login">Log In</NavLink>
                    )}
                </li>
            </ul>
            <div className="navbar-toggle">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            {/* Çıkış Modalı */}
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

            {/* Bildirim Modalı */}
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
