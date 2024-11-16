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
import ProductDetailsPage from '../product-page/ProductDetailsPage';
import OrderAdminPage from '../../pages/OrderAdminPage';
import OrdersProgress from '../orders-progress/OrdersProgress';
import Requests from '../requests/Requests';

const App = () => {
	const [activeUser, setActiveUser] = useState(null);
	// Runs when isUserUpdated becomes true
	useEffect(() => {
		if (activeUser) {
		  console.log("Active user updated, loading user data...");
		  loadUser(); // Trigger loadUser when activeUser changes
		}
	  }, [activeUser]); 

	const loadUser = () => {
		GetActiveUser()
			.then(data => setActiveUser(data.user))  // Sets the active user
			.catch((error) => console.log(error.message));
	};



	return (
		<Router>
			<Navbar activeUser={activeUser} setActiveUser={setActiveUser} />
			<main>
			<Routes>
				<Route path='/'></Route>
				<Route path='/aboutUs'></Route>
				<Route path='/products' element={<ProductsPage/>}></Route>
				<Route path='/products/:id' element={<ProductDetailsPage/>}></Route>
				<Route path='/sectors'></Route>
				<Route path='/solutions'></Route>
				<Route path='/consultancy'></Route>
				<Route path='/contactUs'></Route>
				<Route path='/forgot-password-request' element={<ForgotPasswordRequest />}></Route>
				<Route path='/create-password' element={<CreatePasswordForm/>}></Route>
				{/* <Route path='/profile/*' element={<UserProfilePage />}>
					<Route path='dashboard'></Route>
					<Route path='orders'></Route>
					<Route path='cart'></Route>
					<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
					<Route path='contacts'></Route>
					<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
						<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>} />
					</Route>
					<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>
					
				</Route> */}
				<Route path='/profile/*' element={<OrderAdminPage/>}>
					<Route path='dashboard'></Route>
					<Route path='orders-progress' element={<OrdersProgress/>}></Route>
					<Route path='requests' element={<Requests/>}></Route>
					<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
					<Route path='contacts'></Route>
					<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
						<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>} />
					</Route>
					<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>
					
				</Route>
				<Route path='/registration' element={<SignInPage />}></Route>
				<Route path='/login' element={<LogInForm setActiveUser={setActiveUser} />}></Route>
			</Routes>
			</main>
		</Router>
	);
}

	export default App;
