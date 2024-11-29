import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import "./form.scss";
import { LogIn } from '../../services/AuthService';
import InfoModal from '../modals/InfoModal';
const LogInForm = ({ setIsLoggedIn }) => {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();



    const onError = (error) => {
        setLoading(false);
        setError(true);
        setShowModal(true)
        setErrorMessage(error.message)
    }

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const user = await LogIn(values);
            console.log("User logged in")
            setIsLoggedIn(true) // Kullanıcı durumunu günceller
            navigate('/'); // Giriş yaptıktan sonra ana sayfaya yönlendir
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const modal = <div>
        {loaded && navigate('/')}
        {error && createPortal(
            <InfoModal
                title={"Error"}
                subtitle={errorMessage}
                onClose={() => {
                    setShowModal(false)
                    navigate('/');
                }} />,
            document.body
        )}
        {loading && <img src='../../assets/loading-animation.gif'></img>}
        <div className='overlay'></div>
    </div>

    return (
        <div className="form">
            {showModal && modal}
            <h2 className="title-fz28">Login</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().email("Invalid email address").required('This field is required!'),
                    password: Yup.string().required('This field is required!')
                })}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="form__wrapper">
                        <div className="input__wrapper">
                            <label htmlFor="email" className="form__label">Email</label>
                            <Field
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="form__input"
                            />
                            <ErrorMessage component='div' className='form__error' name='email' />
                        </div>
                        <div className="input__wrapper">
                            <label htmlFor="password" className="form__label">Password</label>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="form__input"
                            />
                            <ErrorMessage component='div' className='form__error' name='password' />
                        </div>
                        <div className="form__footer">
                            <Link to="/forgot-password-request" className='form__pages'>Forgot Password?</Link>
                            <button className="button button__long" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                            <p className='form__pages'>Don't have an account? <Link to="/registration" style={{ textDecoration: 'underline' }}>Sign up here</Link></p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LogInForm; 