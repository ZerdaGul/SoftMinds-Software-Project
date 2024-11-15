import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import InfoModal from '../modals/InfoModal';
import { ForgotPasswordSendRequest } from '../../services/AuthService';
import "./form.scss";

const ForgotPasswordRequest = () => {
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


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
        value.preventDefault();
        setLoading(true);
        try {
            await ForgotPasswordSendRequest({email});
            onLoaded();
        } catch (error) {
            onError(error); // Handle error
        }
    };
    const modal = <div>
                        {loaded &&  createPortal(
                            <InfoModal 
                            title={"Check your email!"}
                            onClose={() => {    
                                setShowModal(false)
                                navigate('/create-password')}}/>,
                            document.body
                        )}
                        {error && createPortal(
                            <InfoModal 
                            title={"Error"}
                            subtitle={errorMessage}
                            onClose={() => {    
                                setShowModal(false)
                                navigate('/')}}/>,
                            document.body
                        )}
                        {loading && <img src='../../assets/loading-animation.gif'></img>}
                        <div className='overlay'></div>
                    </div>

    return (
        <div className="form">
            {showModal && modal}
            <h2 className="title-fz28">Forgot Password?</h2>
            <form onSubmit={handleSubmit} className="form__wrapper">
                <div className="input__wrapper">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form__input"
                    />
                </div>
                <button type="submit" className="button button__long">Send Request</button>
            </form>
        </div>
    );
};

export default ForgotPasswordRequest;