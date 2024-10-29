import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./form.scss";

const UpdateProfile = () => {
    const [message, setMessage] = useState("");

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        country: '',
        profilePicture: null
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('This field is required!').min(2, "Must contain at least 2 letters"),
        lastName: Yup.string().required('This field is required!').min(2, "Must contain at least 2 letters"),
        email: Yup.string().email("Invalid email address").required('This field is required!'),
        phone: Yup.string().required('This field is required!'),
        companyName: Yup.string().required('This field is required!'),
        country: Yup.string().required('This field is required!'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        const formDataToSend = new FormData();

        Object.keys(values).forEach((key) => {
            formDataToSend.append(key, values[key]);
        });

        try {
            const response = await fetch("/api/update-profile", {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                setMessage("Profile updated successfully.");
            } else {
                setMessage("Unable to update profile. Please try again.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
        }

        setSubmitting(false);
    };

    const handleFileChange = (setFieldValue, e) => {
        setFieldValue("profilePicture", e.currentTarget.files[0]);
    };

    return (
        <div className="form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
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
                            <label className="form__label" htmlFor="firstName">First Name</label>
                            <Field
                                name="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="firstName" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="lastName">Last Name</label>
                            <Field
                                name="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="lastName" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="email">Email Address</label>
                            <Field
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="email" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="phone">Phone Number</label>
                            <Field
                                name="phone"
                                type="text"
                                placeholder="Your phone number"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="phone" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="companyName">Company Name</label>
                            <Field
                                name="companyName"
                                type="text"
                                placeholder="Company name"
                                className="form__input"
                            />
                            <ErrorMessage component="div" className="form__error" name="companyName" />
                        </div>

                        <div className="input__wrapper">
                            <label className="form__label" htmlFor="country">Country</label>
                            <Field
                                name="country"
                                type="text"
                                placeholder="Your country"
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

                        <button type="submit" className="button__long" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Profile'}
                        </button>
                    </Form>
                )}
            </Formik>
            {message && <p className="form__error">{message}</p>}
        </div>
    );
};

export default UpdateProfile;