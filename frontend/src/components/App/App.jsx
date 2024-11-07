import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from '../navbar/Navbar';
import SignInPage from '../../pages/SignInPage';
import UserProfilePage from '../../pages/UserProfilePage';
import LogInForm from '../forms/LogInForm';
import ForgotPassword from '../forms/ForgotPassword'
import ProfileForm from '../forms/ProfileForm';
import Settings from '../settings/Settings';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import UpdateProfile from '../forms/UpdateProfile';
import { GetActiveUser } from '../../services/AuthService';
import CartForm from "../forms/CartForm";

const App = () => {

	//get a active user fron sessin info
    const [activeUser, setActiveUser] = useState({});
    useEffect(() => {
		loadUser();
	}, [])
    
    const loadUser = () => {
        GetActiveUser()
            .then(data => setActiveUser(data.user))
            .catch((error) => console.log(error.message));
    }
	const isEmpty = (obj) => obj && typeof obj === 'object' && Object.keys(obj).length === 0;

	if (!isEmpty(activeUser)) {
		localStorage.setItem('current-user', JSON.stringify(activeUser));
	}


	return (
		<Router>
			<Navbar />
			<main>
			<Routes>
				<Route path='/'></Route>
				<Route path='/aboutUs'></Route>
				<Route path='/products'></Route>
				<Route path='/sectors'></Route>
				<Route path='/solutions'></Route>
				<Route path='/consultancy'></Route>
				<Route path='/contactUs'></Route>
				<Route path='/profile/*' element={<UserProfilePage />}>
					<Route path='dashboard'></Route>
					<Route path='orders'></Route>
					<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
					<Route path='contacts'></Route>
					<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
						<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>} />
					</Route>
					
					<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>
					<Route path='forgot-password' element={<ForgotPassword />}></Route>
				</Route>
				<Route path='/registration' element={<SignInPage />}></Route>
				<Route path='/login' element={<LogInForm />}></Route>
			</Routes>
				<CartForm />
			</main>
		</Router>
	);
}

	export default App;
