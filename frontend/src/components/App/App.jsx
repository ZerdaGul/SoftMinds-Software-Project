import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { GetActiveUser, LogOut } from '../../services/AuthService';
import ForgotPasswordRequest from '../forms/ForgotPasswordRequest';
import CreatePasswordForm from '../forms/CreatePasswordForm';
import ProductsPage from '../../pages/ProductsPage';
import ProductDetailsPage from '../product-page/ProductDetailsPage';
import OrderAdminPage from '../../pages/OrderAdminPage';
import HomePage from "../forms/HomePage";
import AboutUs from "../../pages/AboutUs";
import ProductsForAdmin from "../../pages/ProductsForAdmin";
import CardForm from "../forms/CardForm";
import ProductDashboard from "../../dashboard/ProductDashboard";
import SectorPage from "../../pages/SectorPage";
import ConsultancyPage from "../../pages/ConsultancyPage";
import SolutionPage from "../../pages/SolutionPage";

const App = () => {
	const [activeUser, setActiveUser] = useState(null);

	// Kullanıcı bilgilerini yükleme
	const loadUser = () => {
		GetActiveUser()
			.then((user) => {
				setActiveUser(user);
			})
			.catch(() => {
				setActiveUser(null);
			});
	};

	useEffect(() => {
		const storedUser = localStorage.getItem('current-user');
		if (storedUser) {
			setActiveUser(JSON.parse(storedUser));
		} else {
			loadUser();
		}
	}, []);

	const handleLogout = async () => {
		try {
			await LogOut();
			localStorage.removeItem('current-user');
			setActiveUser(null);
		} catch (error) {
			console.error("Logout sırasında hata oluştu:", error);
		}
	};

	// Rol tabanlı erişim kontrolü
	const PrivateRoute = ({ roles, element }) => {
		if (!activeUser) {
			return <Navigate to="/login" />;
		}
		if (!roles.includes(activeUser.role)) {
			return <Navigate to="/" />;
		}
		return element;
	};

	return (
		<Router>
			<Navbar activeUser={activeUser} onLogout={handleLogout} />
			<main>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/aboutUs" element={<AboutUs />} />
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/sectors" element={<SectorPage />} />
					<Route path="/solutions" element={<SolutionPage />} />
					<Route path="/consultancy" element={<ConsultancyPage />} />
					<Route path="/products/:id" element={<ProductDetailsPage />} />

					{/* Customer rolüne özel rotalar */}
					<Route
						path="/profile"
						element={<PrivateRoute roles={['customer']} element={<UserProfilePage />} />}
					/>
					<Route
						path="/cart"
						element={<PrivateRoute roles={['customer']} element={<CardForm />} />}
					/>

					{/* Product Admin rolüne özel rotalar */}
					<Route
						path="/product-dashboard"
						element={<PrivateRoute roles={['product admin']} element={<ProductDashboard />} />}
					/>
					<Route
						path="/products-for-admin"
						element={<PrivateRoute roles={['product admin']} element={<ProductsForAdmin />} />}
					/>

					{/* Order Admin rolüne özel rotalar */}
					<Route
						path="/order-admin"
						element={<PrivateRoute roles={['order admin']} element={<OrderAdminPage />} />}
					/>

					{/* Genel rotalar */}
					<Route path="/registration" element={<SignInPage />} />
					<Route
						path="/login"
						element={<LogInForm setActiveUser={setActiveUser} />}
					/>
					<Route path="/forgot-password-request" element={<ForgotPasswordRequest />} />
					<Route path="/create-password" element={<CreatePasswordForm />} />
				</Routes>
			</main>
		</Router>
	);
};

export default App;