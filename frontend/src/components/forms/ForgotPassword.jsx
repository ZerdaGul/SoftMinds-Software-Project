import React, { useState } from 'react';
import "./form.scss";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    setMessage("Password reset link sent to your email."); // Başarılı mesaj
                } else {
                    setMessage("No user found with this email address."); // Kayıtlı olmayan e-posta mesajı
                }
            } else {
                setMessage("Unable to send reset link. Please try again."); // Genel hata mesajı
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="form">
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
                <button type="submit" className="button button__long">Send Reset Link</button>
            </form>
            {message && <p className="form__error">{message}</p>}
        </div>
    );
};

export default ForgotPassword;