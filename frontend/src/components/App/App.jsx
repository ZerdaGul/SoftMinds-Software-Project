import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Navbar from '../navbar/Navbar';
import SignInForm from '../forms/SignInForm';

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
					<Route path='/profile'></Route>  
					<Route path='/registration' element={<SignInForm/>}></Route>
					
				</Routes>
			</main>
		</Router>
	);
}

	export default App;
