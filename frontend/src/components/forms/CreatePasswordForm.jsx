import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createPortal } from 'react-dom';
import "./form.scss";
import { CreatePassword } from '../../services/AuthService';
import InfoModal from '../modals/InfoModal';

const CreatePasswordForm = () => {
    const [password, setPassword] = useState('');
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
    

    const validateConfirmation = (value) => {
        let error;
        if (value!== password) {
            error = "Mismatch with your password"
        }
        return error;
    }

    const handleSubmit = async({token, password}) => {
        
        try{
            await CreatePassword({token, newPassword: password});
            onLoaded(); // Call onLoaded if successful
        } catch (error) {
            onError(error); // Handle error
        }
    }

    
    const modal = <div>
                        {loaded && createPortal(
                            <InfoModal 
                            title={"Success"}
                            subtitle={"Password is updated"}
                            onClose={() => {    
                                setShowModal(false)
                                navigate('/login');}}/>,
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
            <div className="title-fz28">Update Password</div>
            <Formik initialValues={{ token: "",
                                    password: '',
                                    confirmation: ''}}
                    validationSchema={Yup.object({
                        token: Yup.string().required('This field is required!'),
                        password: Yup.string().required('This field is required!').min(8, "Must contain minimum 6 symbols"),
                        confirmation: Yup.string().required('This field is required!').min(8, "Must contain minimum 6 symbols"),
                    })}
                    onSubmit={handleSubmit}
                    >
                    <Form>
                        <div className="form__wrapper">
                            <div className="input__wrapper">
                                <label htmlFor="token" className="form__label">Token</label>
                                <Field
                                    name="token"
                                    type="text"
                                    placeholder="Enter token"
                                    className="form__input"/>
                                <ErrorMessage component='div' className='form__error' name='token'/>
                            </div>
                            <div className="input__wrapper">
                                <label htmlFor="password" className="form__label">Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="form__input"
                                    validate={setPassword}/>
                                <ErrorMessage component='div' className='form__error' name='password'/>
                            </div>
                            
                            <div className="input__wrapper">
                                <label htmlFor="confirmation" className="form__label">Password confirmation</label>
                                <Field
                                    name="confirmation"
                                    type="password"
                                    placeholder="Confirm a password"
                                    className="form__input"
                                    validate={validateConfirmation}/>
                                <ErrorMessage component='div' className='form__error' name='confirmation'/>
                            </div>
                            <button className="button button__long" type="submit">Save New Password</button>
                        </div>
                    </Form>
            </Formik>
        </div>
  )
}

export default CreatePasswordForm;