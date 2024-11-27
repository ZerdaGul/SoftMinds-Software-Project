import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { LoadSectors } from '../../services/ProductService';
import ForgotPasswordRequest from '../forms/ForgotPasswordRequest';
import CreatePasswordForm from '../forms/CreatePasswordForm';
import ProductsPage from '../../pages/ProductsPage';
import ProductDetailsPage from '../product-page/ProductDetailsPage';
import OrderAdminPage from '../../pages/OrderAdminPage';
import OrdersProgress from '../order-admin/orders-progress/OrdersProgress';
import Requests from '../order-admin/requests/Requests';
import HomePage from "../../pages/HomePage";
import AboutUs from "../../pages/AboutUs";
import Footer from '../footer/Footer';
import ProductsForAdmin from "../../pages/ProductsForAdmin";
import CardForm from "../forms/CardForm";
import ProductDashboard from "../../dashboard/ProductDashboard";
import SectorPage from "../../pages/SectorPage";
import SolutionPage from "../../pages/SolutionPage";
import ConsultancyPage from "../../pages/ConsultancyPage";

const App = () => {
	const [activeUser, setActiveUser] = useState(null);
	let isLoggedOut = false; // Kullanıcı çıkış durumu



	// Uygulama başlangıcında localStorage veya sunucudan kullanıcı bilgilerini kontrol et
	useEffect(() => {
		const storedUser = localStorage.getItem('current-user');
		if (storedUser) {
			console.log("LocalStorage'dan kullanıcı bulundu:", JSON.parse(storedUser));
			setActiveUser(JSON.parse(storedUser)); // LocalStorage'dan kullanıcıyı state'e ayarla
		} else {
			console.log("LocalStorage'da kullanıcı yok. Sunucudan kullanıcı bilgisi yükleniyor...");
			loadUser(); // Eğer localStorage'da yoksa sunucudan kullanıcı bilgisi yükle
		}
	}, []);

	// activeUser değişimini izleme ve yükleme
	useEffect(() => {
		if (isLoggedOut || !activeUser) {
			console.log("No active user or user logged out. Skipping loadUser.");
			return;
		}
		console.log("Active user updated:", activeUser);
	}, [activeUser]);



	// Çıkış işlemini yönetme
	const handleLogout = async () => {
		try {
			console.log("Logout işlemi başlatıldı...");
			await LogOut(); // Sunucudan oturumu kapat
			localStorage.removeItem('current-user'); // localStorage'daki kullanıcıyı temizle
			setActiveUser(null); // Kullanıcı state'ini sıfırla
			isLoggedOut = true; // Çıkış durumunu işaretle
			console.log("Logout işlemi tamamlandı.");
		} catch (error) {
			console.error("Logout sırasında hata oluştu:", error.message);
		}
	};

	// Kullanıcı bilgilerini yükleme
	const loadUser = () => {
		console.log("loadUser çağrıldı");

		GetActiveUser()
			.then((user) => {
				console.log("Sunucudan kullanıcı bilgisi alındı:", user);
				if (!user || !user.email) {
					console.error("Kullanıcı bilgisi eksik veya geçersiz:", user);
					setActiveUser(null);
					return;
				}
				setActiveUser(user);
			})
			.catch((err) => {
				console.error("GetActiveUser çağrısında hata oluştu:", err);
				setActiveUser(null); // Hata durumunda kullanıcıyı sıfırla
			});
	};



	return (
		<Router>
			<Navbar activeUser={activeUser} onLogout={handleLogout} />
			<main>
				<Routes>
					<Route path='/' element={<HomePage />}></Route>
					<Route path='/aboutUs' element={<AboutUs />}></Route>
					<Route path='/products' element={<ProductsPage />}></Route>
					<Route path='/products/:id' element={<ProductDetailsPage />}></Route>
					<Route path='/sectors' element={<SectorPage />}></Route>
					<Route path='/solutions' element={<SolutionPage />}></Route>
					<Route path='/consultancy' element={<ConsultancyPage />}></Route>
					<Route path='/contactUs'></Route>
					<Route path='/forgot-password-request' element={<ForgotPasswordRequest />}></Route>
					<Route path='/create-password' element={<CreatePasswordForm />}></Route>
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
					<Route path='/profile/*' element={<OrderAdminPage />}>
						<Route path='dashboard'></Route>
						<Route path='orders-progress' element={<OrdersProgress />}></Route>
						<Route path='requests' element={<Requests />}></Route>
						<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
						<Route path='orders-progress'></Route>
						<Route path='requests'></Route>
						<Route path='my-profile' element={<ProfileForm initialValues={activeUser || {}} />}></Route>
						<Route path='contacts'></Route>
						<Route path='settings/*' element={<Settings initialValues={activeUser} />}>
							<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser} />} />
						</Route>
						<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>

					</Route>
					<Route path='/registration' element={<SignInPage />}></Route>
					<Route path='/login' element={<LogInForm setActiveUser={setActiveUser} />}></Route>
				</Routes>
			</main>
			{/* Footer Section */}
			<Footer />
		</Router>

	);
}

export default App;