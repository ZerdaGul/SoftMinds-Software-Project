import React from 'react'
import { Outlet} from 'react-router-dom';

import SideMenu from '../components/side-menu/SideMenu';

import orders from '../assets/icons/profile/orders.svg';
import cart from '../assets/icons/profile/cart.svg';
const links=[
  {
    path: '/profile/orders',
    text: 'My Orders',
    alt: 'orders',
    icon: orders
  },
  {
    path: '/profile/cart',
    text: 'My Cart',
    alt: 'cart',
    icon: cart
  }
]
const UserProfilePage = () => {
  return (
    <div style={{display: 'flex'}}>
        <SideMenu main_menu={links}/>
            <Outlet style={{paddingTop: '24px', paddingLeft: "30px" , }}/>
    </div>
    
  )
}

export default UserProfilePage