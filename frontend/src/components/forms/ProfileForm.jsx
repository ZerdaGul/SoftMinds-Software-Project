import React, { useEffect, useState } from 'react';
import './ProfileForm.scss';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        companyName: '',
        country: '',
        profilePicture: '../assets/icons/default-profile.png' // Varsayılan profil resmi
    });

    // Kullanıcı bilgilerini backend'den al
    useEffect(() => {
        // API isteği yaparak kullanıcı verilerini al
        fetch("http://localhost:5000/api/user-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('authToken')}` // Giriş yapan kullanıcı için token ekleyin
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUserData(data.user); // Gelen veriyi state'e kaydet
                } else {
                    console.error("Kullanıcı verisi alınamadı.");
                }
            })
            .catch(error => {
                console.error("Veri alma hatası:", error);
            });
    }, []); // Sadece bir kez çalıştırmak için boş bir bağımlılık dizisi

    const handleEditClick = () => {
        navigate('/profile/update-profile'); // Update Profile sayfasına yönlendir
    };

    return (
        <div className="profile-form">
            <div className="profile-header">
                <div className="profile-picture-wrapper">
                    <img
                        src={userData.profilePicture} // Kullanıcının profil resmi
                        alt="Profile"
                        className="profile-picture"
                    />
                    <FaEdit
                        className="edit-icon"
                        onClick={handleEditClick}
                    />
                </div>
                <div className="profile-info">
                    <h2>{userData.companyName || "Company Name"}</h2>
                    <p>{userData.email || "user@example.com"}</p>
                </div>
            </div>

            <form className="form__wrapper">
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        placeholder="Your First Name"
                        className="form__input"
                        readOnly // Sadece görüntüleme için
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        placeholder="Your Last Name"
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={userData.phone}
                        placeholder="Your Phone Number"
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        placeholder="Your Email Address"
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="companyName">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={userData.companyName}
                        placeholder="Company Name"
                        className="form__input"
                        readOnly
                    />
                </div>
                <div className="input__wrapper">
                    <label className="form__label" htmlFor="country">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={userData.country}
                        placeholder="Your Country"
                        className="form__input"
                        readOnly
                    />
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;