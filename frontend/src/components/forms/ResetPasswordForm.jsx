import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import "./form.scss";
import forward from '../../assets/icons/arrow-forward.svg'
import { GetActiveUser } from '../../services/AuthService';

const ResetPasswordForm = () => {
    const[validEmail, setValidEmail] = useState(false);
    const [activeUser, setActiveUser] = useState({});
    useEffect(() => {
        loadUser();
      }, [])
    
    const loadUser = () => {
        GetActiveUser()
            .then(data => setActiveUser(data.user))
            .catch((error) => console.log(error.message));
    }

    //two forms for email and reset
    //if email is correct and sucha user exist, show reset form
    //add state modals
  return (
    <div className="form">
            <div className="title-fz28">Update Password</div>
            <Formik initialValues={{email: '',
                                    password: '',
                                    confirmation: ''}}
                    validationSchema={Yup.object({
                        email: Yup.string().email("Invalid email address").required('This field is required!').min(2, "Must contain minimum 6 symbols"),
                        password: Yup.string().required('This field is required!').min(8, "Must contain minimum 6 symbols"),
                        confirmation: Yup.string().required('This field is required!').min(8, "Must contain minimum 6 symbols"),
                    })}
                    onSubmit={value => handleSubmit(value)}
                    >
                    <Form>
                        <div className="form__wrapper">
                            <div className="input__wrapper">
                                <label htmlFor="email" className="form__label">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    className="form__input"/>
                                <ErrorMessage component='div' className='form__error' name='email'/>
                            </div>

                            <button type='button' className="button button__long" onClick={() => setPage(2)}>Next step</button>
                        </div>  
                  

                        <div className="form__wrapper">
                            
                            
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
                            <button className="button button__long" type="submit">Create Account</button>
                        </div>
                    </Form>
            </Formik>
        </div>
  )
}

export default ResetPasswordForm