
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
// import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import CountryCode from './CountryCode';

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
        if (value !== password) {
            return "Mismatch with your password"
        }
    }

    return (
        <div className="form">
            <div className="title-fz28">Sign In</div>
            <p className="pages">Page {page} of 2</p>
            <Formik initialValues={{name: userInfo.name,
                                    surname: userInfo.surname,
                                    countrycode: userInfo.countrycode,
                                    phone: userInfo.phone,
                                    email: userInfo.email,
                                    password: userInfo.password,
                                    confirmation: userInfo.confirmation}}
                    validationSchema={Yup.object({
                        name: Yup.string().required('This field is required!').length(2, "Must contain minimum 2 letters"),
                        surname: Yup.string().required('This field is required!').length(2, "Must contain minimum 2 letters"),
                        countrycode: Yup.string().required('Select your country code!'),
                        phone: Yup.string().required('This field is required!'),
                        email: Yup.string().email("Invalid email address").required('This field is required!').length(2, "Must contain minimum 6 symbols"),
                        password: Yup.string().required('This field is required!').length(2, "Must contain minimum 6 symbols"),
                        confirmation: Yup.string().required('This field is required!').length(2, "Must contain minimum 6 symbols"),
                    })}
                    // onSubmit={}
                    >
                    <Form>
                        <div className="form__wrapper">
                            <label htmlFor="name" className="form__label">Name</label>
                            <Field
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                className="form__input"/>
                            <ErrorMessage component='div' className='form__error' name='name'/>

                            <label htmlFor="surname" className="form__label">Surname</label>
                            <Field
                                name="surname"
                                type="text"
                                placeholder="Enter your surname"
                                className="form__input"/>
                            <ErrorMessage component='div' className='form__error' name='surname'/>
                            
                            <div className="form__input phone__input">
                                <label htmlFor="phone" className="form__label">Phone number</label>
                                <CountryCode
                                    name="countrycode"
                                    className="form__input-code"
                                    />
                                <Field
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="form__input-phone"/>
                                <ErrorMessage component='div' className='form__error' name='phone'/>
                            </div>

                            <label htmlFor="email" className="form__label">Email</label>
                            <Field
                                name="email"
                                type="email"
                                placeholder="Enter email address"
                                className="form__input"/>
                                <ErrorMessage component='div' className='form__error' name='email'/>

                            <label htmlFor="password" className="form__label">Password</label>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                className="form__input"
                                onKeyUp={setPassword}/>
                            <ErrorMessage component='div' className='form__error' name='password'/>

                            <label htmlFor="confirmation" className="form__label">Password confirmation</label>
                            <Field
                                name="confirmation"
                                type="password"
                                placeholder="Confirm a password"
                                className="form__input"
                                validate={validateConfirmation}/>
                            <ErrorMessage component='div' className='form__error' name='confirmation'/>
                        </div>
                    </Form>

            </Formik>
        </div>
    )
}

export default SignInForm;