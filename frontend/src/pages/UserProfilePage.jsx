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
const UserProfilePage = (activeUser) => {
  return (
    <div className='container' style={{display: 'flex'}}>
        <SideMenu main_menu={links}
        activeUser ={activeUser}/>
            <Outlet style={{paddingTop: '24px', paddingLeft: "30px" , }}/>
    </div>
    
  )
}

export default UserProfilePage