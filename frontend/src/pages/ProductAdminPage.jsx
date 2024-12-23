import React from 'react'
import { Outlet} from 'react-router-dom';

import SideMenu from '../components/side-menu/SideMenu';

import orders from '../assets/icons/profile/orders.svg';
import dashboard from '../assets/icons/profile/dashboard.svg';
const links=[
    {
        path: '/profile/dashboard',
        text: 'Dashboard',
        alt: 'dashboard',
        icon: dashboard
    },
    {
        path: '/products-admin',
        text: 'Manage Products',
        alt: 'products',
        icon: orders
    },
    {
      path: '/profile/questions',
      text: 'Questions',
      alt: 'questions',
      icon: orders
    },
  
]

const ProductAdminPage = ({activeUser}) => {
  return (
    <div className='container' style={{display: 'flex' }}>
        <SideMenu main_menu={links} activeUser={activeUser}/>
            <Outlet />
    </div>
    
  )
}

export default ProductAdminPage