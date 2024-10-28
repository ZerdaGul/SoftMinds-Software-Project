import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Navbar from '../navbar/Navbar';
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
					<Route path='/profile' element={<ProfileForm/>}></Route>
					<Route path='/update-profile' element={<UpdateProfile/>}></Route>
					<Route path='/forgot-password' element={<ForgotPassword/>}></Route>
					<Route path='/login' element={<LogInForm/>}></Route>
					<Route path='/registration' element={<SignInForm/>}></Route>
				</Routes>
			</main>
		</Router>
	);
}

export default App;