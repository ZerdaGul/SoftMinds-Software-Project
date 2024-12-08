import React from 'react';
import { useNavigate } from 'react-router-dom';
import './unauthorizedPage.scss'; // Optional: for styling

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login'); // Replace '/login' with your login route
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div className="unauthorized-page">
            <div className="unauthorized-container">
                <h1>Access Denied</h1>
                <p>You are not authorized to view this page.</p>
                <p>Please log in to continue or return to the previous page.</p>
                <div className="button-group">
                    
                    <button className="button button__small button__small-white" onClick={handleGoBack}>
                        Go Back
                    </button>
                    <button className="button button__small" onClick={handleLoginRedirect}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
