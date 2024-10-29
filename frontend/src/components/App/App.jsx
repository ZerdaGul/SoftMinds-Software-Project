import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Navbar from '../navbar/Navbar';
import SignInPage from '../../pages/SignInPage';
import UserProfilePage from '../../pages/UserProfilePage';
// import LogInForm from '../forms/LogInForm'
import SignInForm from '../forms/SignInForm';
import LogInForm from '../forms/LogInForm';
import ForgotPassword from "../forms/ForgotPassword";
import ProfileForm from "../forms/ProfileForm";
import UpdateProfile from "../forms/UpdateProfile";

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
					<Route path='/profile/*' element={<UserProfilePage/>}></Route>  
					<Route path='/registration' element={<SignInPage/>}></Route>
					
				</Routes>
			</main>
		</Router>
	);
}

export default App;
