
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import earth from '../../assets/icons/earth.svg'
import user from '../../assets/icons/user.svg'
import logo from '../../assets/icons/logo.png'
import './Navbar.scss';
import { LogOut } from '../../services/AuthService';
import ConfirmModal from '../modals/ConfirmModal';

const Navbar = ({ activeUser, setActiveUser }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        try {
            await LogOut(); // Backend çıkış işlemi
            setActiveUser(null); // Kullanıcıyı çıkış yapmış duruma getir
            localStorage.removeItem('current-user');
            setShowLogoutModal(false);
            navigate('/login'); // Giriş sayfasına yönlendir
        } catch (error) {
            console.error("Çıkış işlemi sırasında hata oluştu:", error);
        }
    };


    const confirmLogout = () => setShowLogoutModal(true);
    const closeModal = () => setShowLogoutModal(false);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="logo" style={{ height: "90px", width: "auto" }} />
                </Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/aboutUs">About Us</NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/products">Products</NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/sectors">Sectors</NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/solutions">Solutions</NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/consultancy">Consultancy</NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/contactUs">Contact Us</NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/"> <img src={earth} alt="languages" style={{height: "20px", width: "auto"}}/>
                    </NavLink>
                </li>
                <li>
                    <NavLink style={({isActive}) => ({color: isActive ? '#FF5733' : '#571846'})}
                             to="/profile"> <img src={user} alt="user" style={{height: "40px", width: "auto"}}/>
                    </NavLink>
                </li>
                <li>
                    {activeUser ? (
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

            {showLogoutModal && 
                createPortal(
                    <ConfirmModal
                    title={"Do you want to log out?"}
                    buttonConfirmText={"Yes"}
                    buttonCloseText={'No'}
                    onClose={closeModal}
                    onConfirm={handleLogout} />,
                    document.body
                )}
        </nav>
    );
};

export default Navbar;
