import React from 'react';
import './ProfileForm.scss';
import { useNavigate } from 'react-router-dom';

import profile_pic from '../../assets/img/profile-pic-default.png';

const ProfileForm = ({ initialValues = {} }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/profile/update-profile'); // Update Profile sayfasına yönlendir
    };

    return (
        <div className="profile-form">
            <div className="profile-header">
                <div className="profile-picture-wrapper">
                    <img
                        src={profile_pic} // Kullanıcının profil resmi
                        alt="Profile"
                        className="profile-picture"
                    />
                </div>
                <div className="profile-info">
                    <h2>{initialValues.name || "Your Name"}</h2>
                    <p>{initialValues.email || "user@example.com"}</p>
                </div>
                <button
                    className="button button__small"
                    onClick={handleEditClick}
                >
                    Edit
                </button>
            </div>

            <form className="form__wrapper">
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={initialValues.name || ""}
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={initialValues.phone || ""}
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={initialValues.email || ""}
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="country">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={initialValues.country || ""}
                        className="form__input"
                        readOnly
                    />
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
