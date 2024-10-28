import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./form.scss";
import './ForgotPassword';
import SignInForm from "./SignInForm";

const LogInForm = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // API isteği
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            const data = await response.json(); // Backend'den dönen yanıtı al

            if (response.ok) {
                // Giriş başarılı, token'ı sakla ve ana sayfaya yönlendir
                localStorage.setItem('authToken', data.token); // Backend'in döndüğü token
                navigate('/'); // Ana sayfaya yönlendir
            } else {
                // Giriş başarısız, mesaj göster
                alert(data.message || "Invalid email or password. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again later.");
        }

        setSubmitting(false); // İşlem bitti, butonu tekrar aktif hale getir
    };

    return (
        <div className="form">
            <h2 className="title-fz28">Login</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().email("Invalid email address").required('This field is required!'),
                    password: Yup.string().required('This field is required!')
                })}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="form__wrapper">
                        <div className="input__wrapper">
                            <label htmlFor="email" className="form__label">Email</label>
                            <Field
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="form__input"
                            />
                            <ErrorMessage component='div' className='form__error' name='email' />
                        </div>
                        <div className="input__wrapper">
                            <label htmlFor="password" className="form__label">Password</label>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="form__input"
                            />
                            <ErrorMessage component='div' className='form__error' name='password' />
                        </div>
                        <div className="form__footer">
                            <p><a href="/forgot-password">Forgot Password?</a></p>
                            <button className="button__long" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                            <p>Don't have an account? <a href="/registration">Sign up here</a></p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LogInForm;