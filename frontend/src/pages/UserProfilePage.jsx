import React from 'react'
import { Outlet} from 'react-router-dom';

import SideMenu from '../components/side-menu/SideMenu';

const UserProfilePage = () => {
  return (
    <div style={{display: 'flex'}}>
        <SideMenu/>
        <section style={{paddingTop: '24px', paddingLeft: "30px"}}>
            <Outlet/>
        </section>
    </div>
    
  )
}

export default UserProfilePage