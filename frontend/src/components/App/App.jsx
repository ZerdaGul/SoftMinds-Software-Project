import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { CSSTransition, SwitchTransition } from 'react-transition-group';


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
import CustomerOrders from '../customer-orders/CustomerOrders';
import UnauthorizedPage from '../../pages/unauthorized-page/UnauthorizedPage';
import QuestionsListCustomer from '../questions-list-customer/QuestionsListCustomer';
import QuestionsList from '../product-admin/questions-list/QuestionsList';


const App = () => {
	const [activeUser, setActiveUser] = useState(null); // Stores the current active user
    const [isLoggedOut, setIsLoggedOut] = useState(false); // Tracks logout state
	const [isLoggedIn, setIsLoggedIn] = useState(false);	// Tracks login state
	const location = useLocation();

	// Load user information on app initialization
	useEffect(() => {
        const storedUser = getUserFromLocalStorage();
        if (storedUser) {
            console.log('User found in localStorage:', storedUser);
            setActiveUser(storedUser);
        }
    }, []);
    useEffect(() => {
        if(!isLoggedOut && isLoggedIn) {
			loadUserFromServer(); // Fetch from server 
		} else {
			setIsLoggedOut(false);
		}
    }, [isLoggedIn]);

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
			window.scrollTo(0, 0);
		}, [pathname]); 

		return null; 
	};
    



	return (
		<>
			<ScrollToTop />
			<Navbar isLoggedIn={isLoggedIn}  setIsLoggedIn={setIsLoggedIn} onLogout={handleLogout} activeUser={activeUser} />
			<main>
			<SwitchTransition>
			<CSSTransition
          key={location.key} 
          classNames="fade" 
          timeout={300} 
          unmountOnExit 
        >
			<div>
			<Routes location={location}>
					<Route path='/' element={<HomePage />}></Route>
					<Route path='/aboutUs' element={<AboutUs />}></Route>
					<Route path='/products' element={<ProductsPage />}></Route>
					<Route path='/products/:id' element={<ProductDetailsPage />}></Route>
					<Route path='/sectors' element={<SectorPage />}></Route>
					<Route path='/solutions' element={<SolutionPage />}></Route>
					<Route path='/consultancy' element={<ConsultancyPage />}></Route>
					<Route path='/cart' element={<CardForm/>}></Route>
					{/*contactUs must be available to authed users, if not - redirect to unauthorized page */}
					<Route path='/contactUs' element={<QuestionsListCustomer/>}></Route>
					<Route path='/faq' element={<FAQPage/>}></Route>
					<Route path='/forgot-password-request' element={<ForgotPasswordRequest />}></Route>
					<Route path='/create-password' element={<CreatePasswordForm />}></Route>
					{activeUser === null &&
						<Route path="/unauthorized" element={<UnauthorizedPage/>}></Route>	
					}
					{activeUser?.role === "customer" && 
						<Route path='/profile/*' element={<UserProfilePage activeUser={activeUser}/>}>
							<Route path='dashboard'></Route>
							<Route path='orders' element={<CustomerOrders userId={activeUser.id}/>}></Route>
							<Route path='cart' element={<CardForm />}></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser}/>}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser}/>} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>
							
						</Route> 
					}
					{activeUser?.role === "padmin" && 
					<>
						<Route path='/products-admin' element={<ProductsForAdmin />}></Route>
						<Route path='/profile/*' element={<ProductAdminPage activeUser={activeUser}/>}>
							<Route path='dashboard' element={<ProductDashboard/>}></Route>
							<Route path='questions' element={<QuestionsList/>}></Route>
							<Route path='my-profile' element={<ProfileForm initialValues={activeUser || {}} />}></Route>
							<Route path='contacts'></Route>
							<Route path='settings/*' element={<Settings initialValues={activeUser} />}>
								<Route path='reset-password' element={<ResetPasswordForm initialValues={activeUser} />} />
							</Route>
							<Route path='update-profile' element={<UpdateProfile initialValues={activeUser} />}></Route>

						</Route>
					</>
					} 
					{activeUser?.role === "oadmin" && 
						<Route path='/profile/*' element={<OrderAdminPage activeUser={activeUser}/>}>
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
				</div>
			{/* Footer Section */}
			</CSSTransition>
			</SwitchTransition>
			</main>
			<Footer />
			</>
	);
}

export default App;

