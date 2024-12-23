import React, {useState} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { SendQuestionsCustomer } from '../../services/QuestionsService';
import './contactForm.scss';
import { createPortal } from 'react-dom';
import InfoModal from '../modals/InfoModal';
import { SendAnswerAdmin } from '../../services/QuestionsService';

const ContactForm = ({label = "Leave a Message", placeholder= "Enter your message", buttonText="Send Message", user="customer", QuestionId}) => {
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
            if (user === "customer"){
                await SendQuestionsCustomer({QuestionText: value.message});
            } else if (user === "admin") {
                await SendAnswerAdmin({QuestionId, AnswerText: value.message})
            }
            
            onLoaded();
        } catch (error) {
            onError(error); // Handle error
        }
    }
    const modal = <div>
                        {loaded && createPortal(
                            <InfoModal 
                            title={"Your message is sent"}
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
            <Formik
                initialValues={{message: '' }}
                validationSchema={Yup.object({
                    message: Yup.string().required('This field is required!')
                })}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="contact__wrapper">
                        <div id='message' className="input__wrapper">
                            <label htmlFor="message" className="form__label">{label}</label>
                            <Field
                                as="textarea"
                                name="message"
                                type="text"
                                placeholder={placeholder}
                                className="form__input "
                            />
                            <ErrorMessage component='div' className='form__error' name='message' />
                        </div>
                        
                        <button id='button' className="button button__long" type="submit" disabled={isSubmitting}>
                            {buttonText}
                        </button>
                    </Form>
                )}
            </Formik>
        </section>
    )
}

export default ContactForm