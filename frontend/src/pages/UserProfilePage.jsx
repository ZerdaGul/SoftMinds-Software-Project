import React from 'react'
import { Routes, Route} from 'react-router-dom';

import Settings from '../components/settings/Settings';
import SideMenu from '../components/side-menu/SideMenu';

const UserProfilePage = () => {
  return (
    <div style={{display: 'flex'}}>
        <SideMenu/>
        <section style={{paddingTop: '24px', paddingLeft: "30px"}}>
            <Routes>
                <Route path='/dashboard'></Route>
                <Route path='/orders'></Route>
                <Route path='/my-profile'></Route>
                <Route path='/contacts'></Route>
                <Route path='/settings' element={<Settings/>}></Route>
            </Routes>
        </section>
    </div>
    
  )
}

export default UserProfilePage