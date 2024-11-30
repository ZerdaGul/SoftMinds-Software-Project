import React from 'react';
import { NavLink } from 'react-router-dom';
import './sideMenu.scss';

const SideMenu = ({ activeUser }) => {
    const aUser = {
        name: "Product Admin",
        email: "padmin@ekoinv.com",
        role: "padmin"
    };
    const getMainMenu = () => {
        if (aUser?.role === "padmin") {
            return [
                { path: "/products-admin", text: "Manage Products" },
                { path: "/product-dashboard", text: "Product Dashboard" }
            ];
        } else if (aUser?.role === "oadmin") {
            return [
                { path: "/orders-progress", text: "Orders Progress" },
                { path: "/requests", text: "Requests" }
            ];
        } else if (aUser?.role === "customer") {
            return [
                { path: "/profile/orders", text: "My Orders" },
                { path: "/profile/cart", text: "My Cart" }
            ];
        } else {
            return [];
        }
    };

    const mainMenu = getMainMenu();

    return (
        <aside className="side-menu">
            <div className="side-menu__title">Main Menu</div>
            <ul className="side-menu__link-wrapper">
                {mainMenu.map(({ path, text }, index) => (
                    <li key={index}>
                        <NavLink
                            to={path}
                            className="side-menu__link"
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? '#F5F2F2' : 'inherit'
                            })}
                        >
                            {text}
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
                <p className="side-menu__user-name">{aUser?.name || "Guest"}</p>
                <p className="side-menu__user-email">{aUser?.email || "Not logged in"}</p>
            </div>
        </aside>
    );
};

export default SideMenu;
