import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
// import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import CountryCode from './CountryCode';
import "./form.scss";
import back from '../../assets/icons/arrow-back.svg'
import PhoneNumber from './PhoneNumber';

const SignInForm = () => {
    const [page, setPage] = useState(1);
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState({name: '',
                                                surname: '',
                                                countrycode: '',
                                                phone: '',
                                                email: '',
                                                password: '',
                                                confirmation: ''});
    
    const validateConfirmation = (value) => {
        let error;
        if (value!== password) {
            error = "Mismatch with your password"
        }
        return error;
    }
    const navigate = useNavigate();

    const handleSubmit = (value) => {
        const {name,
        surname,
        countrycode,
        phone,
        email,
        password}  = value;
        
        const result = {
            name,
            surname,
            phone: countrycode + phone ,
            email,
            password
        }
        console.log(result);
        navigate('/');

    }


    return (
        <div className="form">
            <div className="title-fz28">Sign In</div>
            <p className="form__pages">Page {page} of 2</p>
            <Formik initialValues={{name: userInfo.name,
                                    surname: userInfo.surname,
                                    // countrycode: userInfo.countrycode,
                                    phone: userInfo.phone,
                                    email: userInfo.email,
                                    password: userInfo.password,
                                    confirmation: userInfo.confirmation}}
                    validationSchema={Yup.object({
                        name: Yup.string().required('This field is required!').min(2, "Must contain minimum 2 letters"),
                        surname: Yup.string().required('This field is required!').min(2, "Must contain minimum 2 letters"),
                        // countrycode: Yup.string().required('Select your country code!'),
                        phone: Yup.string().required('This field is required!'),
                        // .matches(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/, 'Invalid phone number'),
                        email: Yup.string().email("Invalid email address").required('This field is required!').min(2, "Must contain minimum 6 symbols"),
                        password: Yup.string().required('This field is required!').min(2, "Must contain minimum 6 symbols"),
                        confirmation: Yup.string().required('This field is required!').min(2, "Must contain minimum 6 symbols"),
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
                                    className="form__input"
                                    name="phone"
                                    type="tel"
                                    placeholder="Number"/>
                                <ErrorMessage component='div' className='form__error' name='phone'/>
                                {/* <label htmlFor="phone" className="form__label">Phone number</label>
                                <div className="form__input phone__input">
                                    <CountryCode
                                        name="countrycode"
                                        className="form__input-code"
                                    />
                                    <Field
                                        name="phone"
                                        type="tel"
                                        placeholder="Number"
                                        className="form__input-phone"/>
                                    <ErrorMessage component='div' className='form__error' name='phone'/>
                                </div>  */}
                            </div>
                            <button type='button' className="button__long" onClick={() => setPage(2)}>Next step</button>
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
                            <button className="button__long" type="submit">Create Account</button>
                        </div>}
                    </Form>
            </Formik>
        </div>
    )
}

export default SignInForm;