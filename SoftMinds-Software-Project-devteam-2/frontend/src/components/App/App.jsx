import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from '../navbar/Navbar';
import SignInPage from '../../pages/SignInPage';
import UserProfilePage from '../../pages/UserProfilePage';
import LogInForm from '../forms/LogInForm';
import ProfileForm from '../forms/ProfileForm';
import Settings from '../settings/Settings';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import UpdateProfile from '../forms/UpdateProfile';
import { GetActiveUser } from '../../services/AuthService';
import ForgotPasswordRequest from '../forms/ForgotPasswordRequest';
import CreatePasswordForm from '../forms/CreatePasswordForm';
import ProductsPage from '../../pages/ProductsPage';
import AddProductForm from "../forms/AddProductForm";

const App = () => {
	const [activeUser, setActiveUser] = useState(null);

	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = () => {
		GetActiveUser()
			.then(data => setActiveUser(data.user))
			.catch((error) => console.log(error.message));
	};

	return (
		<Router>
			<Navbar activeUser={activeUser} setActiveUser={setActiveUser}/>
			<main>
				<Routes>
					<Route path='/'></Route>
					<Route path='/aboutUs'></Route>
					<Route path='/products' element={<ProductsPage/>}></Route>
					<Route path='/sectors'></Route>
					<Route path='/solutions'></Route>
					<Route path='/consultancy'></Route>
					<Route path='/contactUs'></Route>
					<Route path='/forgot-password-request' element={<ForgotPasswordRequest/>}></Route>
					<Route path='/create-password' element={<CreatePasswordForm/>}></Route>
					<Route path='/profile/*' element={<UserProfilePage/>}>
						<Route path='dashboard'></Route>
						<Route path='orders'></Route>
						<Route path='my-profile' element={<ProfileForm initialValues={activeUser}/>}></Route>
						<Route path='contacts'></Route>
						<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
							<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>}/>
						</Route>

						<Route path='update-profile' element={<UpdateProfile initialValues={activeUser}/>}></Route>

					</Route>
					<Route path='/registration' element={<SignInPage/>}></Route>
					<Route path='/login' element={<LogInForm setActiveUser={setActiveUser}/>}></Route>
				</Routes>
			</main>
		</Router>
	);
}

export default App;
