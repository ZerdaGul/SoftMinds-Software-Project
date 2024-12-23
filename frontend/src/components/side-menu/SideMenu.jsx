import React from 'react';
import { NavLink } from 'react-router-dom';
import './sideMenu.scss';

const SideMenu = ({ main_menu, requestsNotification, activeUser }) => {
    

    return (
        <aside className="side-menu">
            <div className="side-menu__title">Main Menu</div>
            <ul className="side-menu__link-wrapper">
                {main_menu.map(({ path, text }, index) => (
                    <li key={index}>
                        <NavLink
                            to={path}
                            className="side-menu__link"
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? '#F5F2F2' : 'inherit'
                            })}
                        >
                            {text}
                            {requestsNotification>0 && text==='Requests' &&
                                <div className="indicator">{requestsNotification}</div> }
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="side-menu__title">Account</div>
            <ul className="side-menu__link-wrapper">
                <li>
                    <NavLink
                        to="/profile/my-profile"
                        className="side-menu__link"
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? '#F5F2F2' : 'inherit'
                        })}
                    >
                        My Profile
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/profile/contacts"
                        className="side-menu__link"
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? '#F5F2F2' : 'inherit'
                        })}
                    >
                        Contacts
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/profile/settings"
                        className="side-menu__link"
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? '#F5F2F2' : 'inherit'
                        })}
                    >
                        Settings
                    </NavLink>
                </li>
            </ul>

            <div className="side-menu__user">
                <img src="" alt="" className="side-menu__user-pic" />
                <p className="side-menu__user-name">{activeUser?.name || "Guest"}</p>
                <p className="side-menu__user-email">{activeUser?.email || "Not logged in"}</p>
            </div>
        </aside>
    );
};

export default SideMenu;
