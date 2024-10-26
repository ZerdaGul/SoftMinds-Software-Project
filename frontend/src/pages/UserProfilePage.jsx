import React from 'react'
import { Routes, Route} from 'react-router-dom';


import SideMenu from '../components/side-menu/SideMenu';

const UserProfilePage = () => {
  return (
    <>
        <SideMenu/>
        <section>
            <Routes>
                <Route path='/dashboard'></Route>
                <Route path='/orders'></Route>
                <Route path='/my-profile'></Route>
                <Route path='/contacts'></Route>
                <Route path='/settings'></Route>
            </Routes>
        </section>
    </>
    
  )
}

export default UserProfilePage