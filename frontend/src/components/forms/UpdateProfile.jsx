import React, {useState, useEffect}from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {UpdateUser,  } from '../../services/AuthService'
import { createPortal } from 'react-dom';

import InfoModal from '../modals/InfoModal';
import profile_pic from '../../assets/img/profile-pic-default.png';
import './ProfileForm.scss'
import './form.scss'
import back from '../../assets/icons/arrow-back.svg'

const UpdateProfile = ({ initialValues,  }) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState( null);
    const [previewUrl, setPreviewUrl] = useState( profile_pic); // Updated: Separate preview URL
    const navigate = useNavigate();

    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setPreviewUrl(objectUrl);
            
            return () => URL.revokeObjectURL(objectUrl);  // Clean up the URL object when component unmounts
        }
    }, [imageFile]);
    
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
    const handleSubmit = async (value) => {
        const data = {
            name: value.name,
            currentEmail: initialValues.email,
            email: value.email,
            companyName: value.companyName??initialValues.companyName,
            currentPassword: value.password,
            phone: value.phone??initialValues.phone,
            country: value.country??initialValues.country,
        }
        setLoading(true);
        try {
            await UpdateUser(data);
            onLoaded(); // Call onLoaded if successful
        } catch (error) {
            onError(error); // Handle error
        }
    };

    const modal = <div>
                        {loaded && createPortal(
                            <InfoModal 
                            title={"Success"}
                            subtitle={"Your profile is updated"}
                            onClose={() => {    
                                setShowModal(false)
                                navigate('/profile/my-profile');}}/>,
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
                        {loading && <img src='../../assets/loading-animation.gif' alt="loading"></img>}
                        <div className='overlay'></div>
                    </div>
    // Define your validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        companyName: Yup.string().required('Company name is required'),
        country: Yup.string().required('Country is required'),
        image: Yup.mixed(),
        password: Yup.string().required('This field is required!').min(8, "Must contain minimum 8 symbols"),
    });

    

    return (
        <div className="form">
            {showModal && modal}
            <div className="title-fz28">Update Profile</div>
            <Formik
                initialValues={{
                    password: '', 
                    image: null,
                    name: initialValues.name || '',
                    email: initialValues.email || '',
                    phone: initialValues.phone || '',
                    companyName: initialValues.companyName || '',
                    country: initialValues.country || '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >

                <Form>
                    {(page===1) ? 
                    <div className="form__wrapper">
                        <div className="profile-header"  style={{justifyContent: "center"}}>
                            <div className="profile-picture-wrapper">
                                <img
                                    src={previewUrl}
                                    alt="Profile"
                                    className="profile-picture"
                                />
                                
                            </div>
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="name">Full Name</label>
                            <Field
                                name="name"
                                type="text"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="name" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="email">Email Address</label>
                            <Field
                                name="email"
                                type="email"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="email" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="phone">Phone Number</label>
                            <Field
                                name="phone"
                                type="text"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="phone" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="companyName">Company Name</label>
                            <Field
                                name="companyName"
                                type="text"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="companyName" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="country">Country</label>
                            <Field
                                name="country"
                                type="text"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="country" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="image">Profile Picture</label>
                            <Field
                                name="image"
                                component={ImageUploadField}
                                setImageFile={setImageFile}  
                            />
                        </div>

                        <button type="button" onClick={() => setPage(2)} className="button button__long" disabled={loading}>
                            Update Profile
                        </button>
                    </div> 
                    :
                    <div className="form__wrapper">
                        <a href='#' className="form__pages back" onClick={() => setPage(1)}>
                            <img src={back} alt="arrow-back" />
                            Back to updates
                        </a>
                        <div className="input__wrapper">
                            <label htmlFor="password" className="form__label">Verification</label>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="form__input"/>
                            <ErrorMessage component='div' className='form__error' name='password'/>
                        </div>
                        <button className="button button__long" disabled={loading} type="submit">Confirm</button>
                    </div>}
                </Form>
            </Formik>
        </div>
    );
};

export default UpdateProfile;


// Custom Image Upload Field Component
const ImageUploadField = ({ name, setImageFile }) => {
    const { setFieldValue } = useFormikContext();
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFieldValue(name, file || ''); // Set a fallback to avoid undefined
            setImageFile(file);
            setPreview(URL.createObjectURL(file)); // Display preview
        }
    };

    return (
        <div className='form__input form__input-image-wrapper'>
            <input
                id={name}
                name={name}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {preview && (
                <img
                    src={preview}
                    alt="preview"
                    className='image'
                />
            )}
        </div>
    );
};
