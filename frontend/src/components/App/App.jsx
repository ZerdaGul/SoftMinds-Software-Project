import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Navbar from '../navbar/Navbar';
import SignInPage from '../../pages/SignInPage';
import UserProfilePage from '../../pages/UserProfilePage';

import LogInForm from '../forms/LogInForm';
import ForgotPassword from "../forms/ForgotPassword";
import ProfileForm from "../forms/ProfileForm";
import UpdateProfile from "../forms/UpdateProfile";
import Settings from '../settings/Settings';
import ResetPasswordForm from '../forms/ResetPasswordForm';

function App() {
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
						<Route path='my-profile' element={<ProfileForm />}></Route>
						<Route path='contacts'></Route>
						<Route path='settings/*' element={<Settings />}>
							<Route path='reset-password' element={<ResetPasswordForm />} /> 
						</Route>
						<Route path='update-profile' element={<UpdateProfile />}></Route>
						<Route path='forgot-password' element={<ForgotPassword />}></Route>
					</Route>
					<Route path='/registration' element={<SignInPage />}></Route>
					<Route path='/login' element={<LogInForm />}></Route>
				</Routes>
			</main>
		</Router>

	);
}

export default App;
