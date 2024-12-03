import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';


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
import FAQPage from '../FAQPage/FAQPage';
import AboutUs from "../../pages/AboutUs";
import Footer from '../footer/Footer';
import ContactForm from '../contact-form/ContactForm';
import ProductsForAdmin from "../../components/product-admin/ProductsForAdmin";
import CardForm from "../forms/CardForm";
import ProductDashboard from '../../components/product-admin/dashboard/ProductDashboard'
import SectorPage from "../../pages/SectorPage";
import SolutionPage from "../../pages/SolutionPage";
import ConsultancyPage from "../../pages/ConsultancyPage";
import OrderAdminDashboard from '../order-admin/dashboard/Dashboard';
import ProductAdminPage from '../../pages/ProductAdminPage';


const App = () => {
	const [activeUser, setActiveUser] = useState(null); // Stores the current active user
    const [isLoggedOut, setIsLoggedOut] = useState(false); // Tracks logout state
	const [isLoggedIn, setIsLoggedIn] = useState(false);	// Tracks login state

	// Load user information on app initialization
    useEffect(() => {
        const storedUser = getUserFromLocalStorage();
        if (storedUser) {
            console.log('User found in localStorage:', storedUser);
            setActiveUser(storedUser);
        } else {
            loadUserFromServer(); // Fetch from server if no stored user and not logged out
        } 
    }, [isLoggedIn, isLoggedOut]);

	const getUserFromLocalStorage = () => {
        const storedUser = localStorage.getItem('current-user');
        return storedUser ? JSON.parse(storedUser) : null;
    };

    // Utility: Save user to localStorage
    const saveUserToLocalStorage = (user) => {
        if (user) {
            localStorage.setItem('current-user', JSON.stringify(user));
        } else {
            localStorage.removeItem('current-user');
        }
    };

    // Fetch user info from the server
    const loadUserFromServer = async () => {
        console.log('Fetching user from the server...');
        try {
            const user = await GetActiveUser();
            if (user && user.email) {
                console.log('User fetched successfully:', user);
                saveUserToLocalStorage(user); // Save user to localStorage
                setActiveUser(user); // Update state
            } else {
                console.warn('Invalid user data received:', user);
                setActiveUser(null);
            }
        } catch (error) {
            console.error('Error fetching user from server:', error);
            setActiveUser(null);
        }
    };

    // Handle logout
    const handleLogout = () => {
        console.log('User logged out');
        setIsLoggedIn(false); // Mark user as logged out
        setIsLoggedOut(true); // Set logout state
        setActiveUser(null); // Clear active user
        saveUserToLocalStorage(null); // Clear localStorage
    };
	const ScrollToTop = () => {
		const { pathname } = useLocation();

		useEffect(() => {
			window.scrollTo(0, 0); // Sayfanın en üstüne kaydır
		}, [pathname]); // Rota değişikliklerinde çalışır

		return null; // Görünür bir bileşen olmadığı için null döner
	};
    



	return (
		<Router>
			<ScrollToTop />
			<Navbar isLoggedIn={isLoggedIn}  setIsLoggedIn={setIsLoggedIn} onLogout={handleLogout} activeUser={activeUser} />
			
			<main>
				<Routes>
					<Route path='/' element={<HomePage />}></Route>
					<Route path='/aboutUs' element={<AboutUs />}></Route>
					<Route path='/products' element={<ProductsPage />}></Route>
					<Route path='/products/:id' element={<ProductDetailsPage />}></Route>
					<Route path='/sectors' element={<SectorPage />}></Route>
					<Route path='/solutions' element={<SolutionPage />}></Route>
					<Route path='/consultancy' element={<ConsultancyPage />}></Route>
					<Route path='/contactUs' element={<ContactForm/>}></Route>
					<Route path='/faq' element={<FAQPage/>}></Route>
					<Route path='/forgot-password-request' element={<ForgotPasswordRequest />}></Route>
					<Route path='/create-password' element={<CreatePasswordForm />}></Route>
					<Route path='/profile/cart' element={CardForm}></Route>
					{"activeUser.role" === "customer" && 
						<Route path='/profile/*' element={<UserProfilePage />}>
							<Route path='dashboard'></Route>
							<Route path='orders'></Route>
							<Route path='cart'></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>
							
						</Route> 
					}
					{"activeUser.role" === "padmin" && 
					<>
						<Route path='/products-admin' element={<ProductsForAdmin />}></Route>
						<Route path='/profile/*' element={<ProductAdminPage />}>
							<Route path='dashboard' element={<ProductDashboard/>}></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser || {}} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser} />}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser} />} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>

						</Route>
					</>
					} 
					{"oadmin" === "oadmin" && 
						<Route path='/profile/*' element={<OrderAdminPage />}>
							<Route path='dashboard' element={<OrderAdminDashboard/>}></Route>
							<Route path='orders-progress' element={<OrdersProgress />}></Route>
							<Route path='requests' element={<Requests />}></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser || {}} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser} />}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser} />} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>

						</Route>
					}
					<Route path='/registration' element={<SignInPage />}></Route>
					<Route path='/login' element={<LogInForm setIsLoggedIn={setIsLoggedIn} />}></Route>
				</Routes>
			</main>
			{/* Footer Section */}
			<Footer />
		</Router>

	);
}

export default App;

{/* {activeUser.role === "customer" && 
						<Route path='/profile/*' element={<UserProfilePage />}>
							<Route path='dashboard'></Route>
							<Route path='orders'></Route>
							<Route path='cart'></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>
							
						</Route> 
					}
					{activeUser.role === "padmin" && 
					<>
						<Route path='product-admin' element={<ProductsForAdmin />}></Route>
						<Route path='/profile/*' element={<ProductAdminPage />}>
							<Route path='dashboard' element={<ProductDashboard/>}></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser || {}} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser} />}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser} />} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>

						</Route>
					</>
					} 
					{activeUser.role === "oadmin" && 
						<Route path='/profile/*' element={<OrderAdminPage />}>
							<Route path='dashboard' element={<OrderAdminDashboard/>}></Route>
							<Route path='orders-progress' element={<OrdersProgress />}></Route>
							<Route path='requests' element={<Requests />}></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser || {}} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser} />}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser} />} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>

						</Route>
					} */}