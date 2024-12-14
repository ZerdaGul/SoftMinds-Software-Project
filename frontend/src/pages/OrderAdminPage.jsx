import React, { useEffect, useState } from 'react'
import { Outlet} from 'react-router-dom';

import SideMenu from '../components/side-menu/SideMenu';
import { GetRequestedOrders } from '../services/OrderAdminService';
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

const OrderAdminPage = (activeUser) => {
    const [orderRequests, setOrderRequests] = useState([]);
    const [requestsCount, setRequestsCount] = useState(0);

    useEffect(()=>{
        LoadRequestedOrders();
    },[])

    const LoadRequestedOrders = async() => {
        try{
            const ordersData = await GetRequestedOrders();
            setOrderRequests(ordersData);
            // Update requestsCount if ordersData is not empty
            if (ordersData && ordersData.length > 0) {
                setRequestsCount(ordersData.length);
            }
        } catch (error) {
            console.log(error.message)
        }
    }
  return (
    <div className='container' style={{display: 'flex'}}>
        <SideMenu main_menu={links} requestsNotification={requestsCount}
        activeUser ={activeUser}/>
            <Outlet context={orderRequests}/>
    </div>
    
  )
}

export default OrderAdminPage