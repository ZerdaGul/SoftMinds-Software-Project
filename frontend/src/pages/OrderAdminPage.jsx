import React from 'react'
import { Outlet} from 'react-router-dom';

import SideMenu from '../components/side-menu/SideMenu';

import orders from '../assets/icons/profile/orders.svg';
import requests from '../assets/icons/profile/request.svg';
import dashboard from '../assets/icons/profile/dashboard.svg';
const links=[
    {
        path: '/profile/dashboard',
        text: 'Dashboard',
        alt: 'dashboard',
        icon: dashboard
    },
    {
        path: '/profile/orders-progress',
        text: 'Orders',
        alt: 'orders',
        icon: orders
    },
    {
        path: '/profile/requests',
        text: 'Requests',
        alt: 'requests',
        icon: requests
    },
  
]

const OrderAdminPage = () => {
  return (
    <div className='container' style={{display: 'flex'}}>
        <SideMenu main_menu={links}/>
            <Outlet />
    </div>
    
  )
}

export default OrderAdminPage