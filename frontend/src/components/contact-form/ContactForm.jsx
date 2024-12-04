import React, {useState} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Contact } from '../../services/AuthService';
import './contactForm.scss';
import { createPortal } from 'react-dom';
import InfoModal from '../modals/InfoModal';

const ContactForm = () => {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);


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
    const handleSubmit = async(value) => {

        try {
            await Contact(value);
            onLoaded();
        } catch (error) {
            onError(error); // Handle error
        }
    }
    const modal = <div>
                        {loaded && createPortal(
                            <InfoModal 
                            title={"Your message is sent"}
                            subtitle={"You will get a response via email"}
                            onClose={() => {    
                                setShowModal(false)
                                }}/>,
                            document.body
                        )}
                        {error && createPortal(
                            <InfoModal 
                            title={"Error"}
                            subtitle={errorMessage}
                            onClose={() => {    
                                setShowModal(false)
                                }}/>,
                            document.body
                        )}
                    </div>

    return (
        <section className="contact__form">
            {showModal && modal}
            <h2 className="title-fz28">Contact Us!</h2>
            <Formik
                initialValues={{ name: '', email: '', message: '' }}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required!'),
                    email: Yup.string().email("Invalid email address").required('This field is required!'),
                    message: Yup.string().required('This field is required!')
                })}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="contact__wrapper">
                        <div id='name' className="input__wrapper">
                            <label htmlFor="name" className="form__label">Name</label>
                            <Field
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                className="form__input"
                            />
                            <ErrorMessage component='div' className='form__error' name='name' />
                        </div>
                        <div id='email' className="input__wrapper">
                            <label htmlFor="email" className="form__label">Email</label>
                            <Field
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="form__input"
                            />
                            <ErrorMessage component='div' className='form__error' name='email' />
                        </div>

                        <div id='message' className="input__wrapper">
                            <label htmlFor="message" className="form__label">Message</label>
                            <Field
                                as="textarea"
                                name="message"
                                type="text"
                                placeholder="Enter your message"
                                className="form__input "
                            />
                            <ErrorMessage component='div' className='form__error' name='message' />
                        </div>
                        
                        <button id='button' className="button button__long" type="submit" disabled={isSubmitting}>
                            Send Message
                        </button>
                    </Form>
                )}
            </Formik>
        </section>
    )
}

export default ContactForm