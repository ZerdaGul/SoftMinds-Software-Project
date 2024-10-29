import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import * as Yup from 'yup';
import "./form.scss";
import { GetActiveUser } from '../../services/AuthService';
import { UpdateUser } from '../../services/AuthService';
import InfoModal from '../modals/InfoModal';


const UpdateProfile = () => {
    
    const [activeUser, setActiveUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
      }, [])
    
    const loadUser = () => {
        GetActiveUser()
            .then(data => setActiveUser(data.user))
            .catch((error) => console.log(error.message));
    }

    const initialValues = {
        name: activeUser.name,
        email: activeUser.email,
        phone: activeUser.phone,
        companyName: '',
        country: activeUser.country,
        profilePicture: null
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('This field is required!').min(2, "Must contain at least 2 letters"),
        email: Yup.string().email("Invalid email address").required('This field is required!'),
        phone: Yup.string().required('This field is required!'),
        companyName: Yup.string(),
        country: Yup.string().required('This field is required!'),
    });

    const handleSubmit = async (value) => {
        const formData={
            name: activeUser.name,
            currentEmail: value.email,
            email: activeUser.email,
            companyName: value.companyName,
            currentPassword: activeUser.password,           //may be deleted
            phone: value.phone,
            country: value.country
        }

        updateUser(formData);
    };
    const onLoaded =() => {
        setLoading(false);
        setLoaded(true);
        setShowModal(true)
        
    }

    const onError = (error) => {
        setLoading(false);
        setError(true);  
        setShowModal(true)
        setErrorMessage(error.message)      
    }

    const updateUser = async (formData) => {
        setLoading(true);
        try {
            await UpdateUser(formData);
            onLoaded(); // Call onLoaded if successful
        } catch (error) {
            onError(error); // Handle error
        }
    };

    const handleFileChange = (setFieldValue, e) => {
        setFieldValue("profilePicture", e.currentTarget.files[0]);
    };
    const modal = <div>
                        {loaded && createPortal(
                            <InfoModal 
                            title={"Success"}
                            onClose={() => {    
                                setShowModal(false)
                                navigate('/');}}/>,
                            document.body
                        )}
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
            <div className="title-fz28">Update Profile</div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({setFieldValue }) => (
                    <Form className="form__wrapper">
                        <div className="profile-header">
                            <div className="profile-picture-wrapper">
                                <img
                                    src={
                                        initialValues.profilePicture
                                            ? URL.createObjectURL(initialValues.profilePicture)
                                            : '../assets/icons/default-profile.png'
                                    }
                                    alt="Profile"
                                    className="profile-picture"
                                />
                                <div className="profile-info">
                                    <h2>Company Name</h2>
                                    <p>richardfeynmann@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="name">Full name</label>
                            <Field
                                name="name"
                                type="text"
                                // placeholder="Enter your full name"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="name" />
                        </div>


                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="email">Email Address</label>
                            <Field
                                name="email"
                                type="email"
                                // placeholder="Enter your email address"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="email" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="phone">Phone Number</label>
                            <Field
                                name="phone"
                                type="text"
                                // placeholder="Your phone number"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="phone" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="companyName">Company Name</label>
                            <Field
                                name="companyName"
                                type="text"
                                // placeholder="Company name"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="companyName" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="country">Country</label>
                            <Field
                                name="country"
                                type="text"
                                // placeholder="Your country"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="country" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="profilePicture">Profile Picture</label>
                            <input
                                type="file"
                                name="profilePicture"
                                accept="image/*"
                                onChange={(e) => handleFileChange(setFieldValue, e)}
                                className="form__input"
                            />
                        </div>

                        <button type="submit" className="button button__long" disabled={loading}>Update Profile </button>
                    </Form>
                )}
            </Formik>
            
        </div>
    );
};

export default UpdateProfile;