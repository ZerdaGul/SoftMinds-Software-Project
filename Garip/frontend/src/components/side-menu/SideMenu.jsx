import React from 'react'
import { NavLink } from 'react-router-dom'

// import cart from '../../assets/icons/profile/cart.svg';
import contacts from '../../assets/icons/profile/contacts.svg';
import settings from '../../assets/icons/profile/settings.svg';
import user from '../../assets/icons/profile/user.svg';
import "./sideMenu.scss"

const SideMenu = ({main_menu}) => {
  return (
    <aside className='side-menu'>
        <div className="side-menu__title">Main menu</div>
        <ul className="side-menu__link-wrapper">
            {main_menu.map(({path, icon, alt, text}) => {
                return(
                    <li>
                        <NavLink className='side-menu__link' to={path}
                            style={({isActive}) => ({backgroundColor: isActive ? '#F5F2F2' : 'inherit'})}>  
                            <img src={icon} alt={alt}></img>
                            {text}</NavLink>
                    </li>
                )
            })}
            {/* <li>
                <NavLink className='side-menu__link' to='/profile/dashboard'
                    style={({isActive}) => ({backgroundColor: isActive ? '#F5F2F2' : 'inherit'})}>   
                    <img src={dashboard} alt='dashboard'></img>
                    Dashboard</NavLink>
            </li>
            <li>
                <NavLink className='side-menu__link' to="/profile/orders"
                    style={({isActive}) => ({backgroundColor: isActive ? '#F5F2F2' : 'inherit'})}>  
                    <img src={orders} alt='orders'></img>
                    Orders</NavLink>
            </li> */}
        </ul>
        <div className="side-menu__title">Account</div>
        <ul className="side-menu__link-wrapper">
            <li>
                <NavLink className='side-menu__link' to="/profile/my-profile"
                    style={({isActive}) => ({backgroundColor: isActive ? '#F5F2F2' : 'inherit'})}>  
                    <img src={user} alt='user'></img>
                    My Profile</NavLink>
            </li>
            <li>
                <NavLink className='side-menu__link' to="/profile/contacts"
                    style={({isActive}) => ({backgroundColor: isActive ? '#F5F2F2' : 'inherit'})}   >
                    <img src={contacts} alt='contacts'></img>
                    Contacts</NavLink>
            </li>
            <li>
                <NavLink className='side-menu__link' to="/profile/settings" 
                    style={({isActive}) => ({backgroundColor: isActive ? '#F5F2F2' : 'inherit'})}   >
                    <img src={settings} alt='settings'></img>
                    Settings</NavLink>
            </li>
        </ul>
        <div className="side-menu__user">
            <img src="" alt="" className="side-menu__user-pic"/>
            <p className="side-menu__user-name"></p>
            <p className="side-menu__user-email"></p>
        </div>
    </aside>
  )
}

export default SideMenu