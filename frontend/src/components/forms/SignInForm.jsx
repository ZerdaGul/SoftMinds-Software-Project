import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { createPortal } from 'react-dom';


import "./form.scss";
import back from '../../assets/icons/arrow-back.svg'
import PhoneNumber from './PhoneNumber';
import { RegisterUser } from '../../services/AuthService';
import InfoModal from '../modals/InfoModal';

const SignInForm = () => {
    const [page, setPage] = useState(1);
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    const onLoaded =() => {
        setLoading(false);
        setLoaded(true);
        setShowModal(true);
        navigate('/login');
    }

    const onError = (error) => {
        setLoading(false);
        setError(true);  
        setShowModal(true)
        setErrorMessage(error.message)      
    }
    
    const validateConfirmation = (value) => {
        let error;
        if (value!== password) {
            error = "Mismatch with your password"
        }
        return error;
    }

    const getCountry = (country => setCountry(country));

    const handleSubmit = async(value) => {
        const {name,
                surname,
                phone,
                email,
                password}  = value;

        const result = {
            name: name + ' '+ surname,
            email,
            password,
            phone: phone.slice(1) ,
            country,
            
                       
        }
        try {
            await RegisterUser(result);
            onLoaded();
        } catch (error) {
            onError(error); // Handle error
        }

    }


    

    const modal = <div>
                        {loaded && navigate('/')}
                        {error && createPortal(
                            <InfoModal 
                            title={"Error"}
                            subtitle={errorMessage}
                            onClose={() => {    
                                setShowModal(false)
                                navigate('/');}}/>,
                            document.body
                        )}
                        {loading && <img src='../../assets/loading-animation.gif'></img>}
                        <div className='overlay'></div>
                    </div>


    return (
        <div className="form">
            {showModal && modal}
            <div className="title-fz28">Sign In</div>
            <p className="form__pages">Page {page} of 2</p>
            <Formik initialValues={{name: '',
                                    surname: '',
                                    phone: '',
                                    email: '',
                                    password: '',
                                    confirmation: ''}}
                    validationSchema={Yup.object({
                        name: Yup.string().required('This field is required!').min(2, "Must contain minimum 2 letters"),
                        surname: Yup.string().required('This field is required!').min(2, "Must contain minimum 2 letters"),
                        phone: Yup.string().required('This field is required!'),
                        email: Yup.string().email("Invalid email address").required('This field is required!').min(2, "Must contain minimum 8 symbols"),
                        password: Yup.string().required('This field is required!').min(8, "Must contain minimum 8 symbols"),
                        confirmation: Yup.string().required('This field is required!').min(8, "Must contain minimum 6 symbols"),
                    })}
                    onSubmit={value => handleSubmit(value)}
                    >
                    <Form>
                        
                        {(page===1) ? 
                        <div className="form__wrapper">
                            <div className="input__wrapper">
                                <label htmlFor="name" className="form__label">Name</label>
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="form__input"/>
                                <ErrorMessage component='div' className='form__error' name='name'/>
                            </div>

                            <div className="input__wrapper">
                                <label htmlFor="surname" className="form__label">Surname</label>
                                <Field
                                    name="surname"
                                    type="text"
                                    placeholder="Enter your surname"
                                    className="form__input"/>
                                <ErrorMessage component='div' className='form__error' name='surname'/>
                            </div>

                            <div className="input__wrapper">
                                <PhoneNumber 
                                    getCountry={getCountry}
                                    className="form__input"
                                    name="phone"
                                    type="tel"
                                    placeholder="Number"/>
                                <ErrorMessage component='div' className='form__error' name='phone'/>
                             
                            </div>
                            <button type='button' className="button button__long" onClick={() => setPage(2)}>Next step</button>
                        </div>  
                        :

                        <div className="form__wrapper">
                            <a href='#' className="form__pages back" onClick={() => setPage(1)}>
                                <img src={back} alt="arrow-back" />
                                Previous step
                                </a>
                            <div className="input__wrapper">
                                <label htmlFor="email" className="form__label">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    className="form__input"/>
                                <ErrorMessage component='div' className='form__error' name='email'/>
                            </div>
                            <div className="input__wrapper">
                                <label htmlFor="password" className="form__label">Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="form__input"
                                    validate={setPassword}/>
                                <ErrorMessage component='div' className='form__error' name='password'/>
                            </div>
                            
                            <div className="input__wrapper">
                                <label htmlFor="confirmation" className="form__label">Password confirmation</label>
                                <Field
                                    name="confirmation"
                                    type="password"
                                    placeholder="Confirm a password"
                                    className="form__input"
                                    validate={validateConfirmation}/>
                                <ErrorMessage component='div' className='form__error' name='confirmation'/>
                            </div>
                            <button className="button button__long" type="submit">Create Account</button>
                        </div>}
                    </Form>
            </Formik>
        </div>
    )
}

export default SignInForm;